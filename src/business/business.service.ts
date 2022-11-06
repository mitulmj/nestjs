import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateBusinessDTO } from './dto/create-business.dto';
import { UpdateBusinessDTO } from './dto/update-business.dto';
import { BusinessDTO } from './dto/business.dto';
import * as fs from 'fs';

import { Business } from './entity/business.entity';
import { CommonService } from 'src/common/common.service';
import { commonStatus } from 'src/interface/comman-status';
import { User } from '../user/entity/user.entity';
import { BusinessTypes } from './entity/business_types.entity';


@Injectable()
export class BusinessService {
    public response : {status: any, message:any, data:any };
    constructor(
        @InjectRepository(Business)
        private businessRepository: Repository<Business>,
        @InjectRepository(BusinessTypes)
        private businessTypeRepository: Repository<BusinessTypes>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private commonService : CommonService
    ) {
        this.response = {
            status:'error',
            message : 'Opps. Somthing went wrong',
            data:[] as any,
        }
    }

    async getAllBusiness(groupId:number,req){
        try {
            const host = req.headers.host;
            const proto = req.protocol;
            const imgLink =  `${proto}://${host}/uploads/business-types/`
            const allBusiness = await this.businessRepository.find({
                where:{groupId:groupId, status:commonStatus.Active},
                relations: {
                    user: true,
                    businessType:true
                },
                select: {
                    user: {
                        name: true,
                        email: true,
                        phone_no:true
                    },
                    businessType:{
                        type_name:true,
                        image_path:true
                    }
                }
            })
            if(allBusiness.length == 0){
                this.response.message = 'No Business Found'
                return this.response
            }
            if(allBusiness.length > 0){
                allBusiness.forEach((business,index)=>{
                    business.businessType.image_path = imgLink + business.businessType.image_path
                });
            }
            this.response.status = "success";
            this.response.message = "Business data succuess fully fetched"
            this.response.data = allBusiness;
            return this.response;
        } catch (error) {
            this.response.message = error.message;
            return this.response;
        }
    }

    async getMyBusiness(req,businessDto : BusinessDTO){
        try {
            const host = req.headers.host;
            const proto = req.protocol;
            const imgLink =  `${proto}://${host}/uploads/business-types/`
            const validation = await this.commonService.validateData(businessDto)
            if(validation.status === 'error'){
                this.response.message = validation.message
                return this.response
            }
            const checkUser = await this.usersRepository.findOne({
                where:{ id : businessDto.userId}
            })
            if(!checkUser){
                this.response.message = 'User not found';
                return this.response;
            }
            const status = commonStatus.Active
            const business = await this.businessRepository
            .createQueryBuilder('business')
            .leftJoinAndSelect('business.user','user')
            .leftJoinAndSelect('business.businessType','businessType')
            .select([
                'business',
                'user.name',
                'user.phone_no',
                'user.email',
                'businessType.type_name',
                'businessType.image_path',
            ]).
            where('business.status IN (:status)',{status:status})
            .andWhere('user.status IN (:status)',{status:status})
            .andWhere('business.groupId IN (:groupId)',{groupId:businessDto.groupId})
            .andWhere('business.userId IN (:userId)',{userId:businessDto.userId})

            let allBusiness = await business.getMany();
            if(allBusiness.length > 0){
                allBusiness.forEach((business,index)=>{
                    business.businessType.image_path = imgLink + business.businessType.image_path
                });
            }
            this.response.status = 'success',
            this.response.message = allBusiness.length > 0 ? 'Business data found success fully' : 'No business found'
            this.response.data = allBusiness;
           return this.response
        } catch (error) {
            this.response.message = error.message;
            return this.response
        }
    }

    async createBusiness(CreateBusinessDTO: CreateBusinessDTO){
        try {
            const validation = await this.commonService.validateData(CreateBusinessDTO)
            if(validation.status === 'error'){
                this.response.message = validation.message
                return this.response
            }
            const status = commonStatus.Active
            const checkBusinessType = await this.businessRepository.createQueryBuilder('business')
            .leftJoinAndSelect('business.businessType','businessType')
            .select([
                'business',
            ]).
            where('business.status IN (:status)',{status:status})
            .andWhere('business.userId IN (:userId)',{userId:CreateBusinessDTO.userId})
            .andWhere('business.businessTypeId IN (:businessTypeId)',{businessTypeId : CreateBusinessDTO.businessTypeId}).getOne()
            if(checkBusinessType){
                this.response.message = `Business type id = '${CreateBusinessDTO.businessTypeId}' is already assign with user id ${CreateBusinessDTO.userId}`
                return this.response;
            }

            
            CreateBusinessDTO.groupId = 1;
            const payload = new Business(CreateBusinessDTO);
            const user = await this.usersRepository.findOne({
                where : {id: CreateBusinessDTO.userId}
            })
            payload.user = user;
            const businessType = await this.businessTypeRepository.findOne({
                where: {id:CreateBusinessDTO.businessTypeId}
            })
            payload.businessType = businessType
            const business = await this.businessRepository.save(payload)
            if (!business) {
                this.response.message =
                  'There is an issue inserting business. Please try again.';
                 return this.response;
              }
            this.response.status = 'success'
            this.response.message = 'Business created successfully.'
            this.response.data = business;
            return this.response;    
        } catch (error) {
            this.response.message = error.message;
            return this.response     
        }
    }

    async updateBusiness(UpdateBusinessDTO:UpdateBusinessDTO,hostUrl){
        try {
            const validation = await this.commonService.validateData(UpdateBusinessDTO)
            if(validation.status === 'error'){
                this.response.message = validation.message
                return this.response
            }
            const payload = new Business(UpdateBusinessDTO);
            payload.id = UpdateBusinessDTO.businessId
            const businessExist = await this.businessRepository.find({
                where:{id:payload.id}
            })
            if(businessExist.length == 0){
                this.response.data = []
                this.response.message = 'Business not found.'
                return this.response;
            }
            if(businessExist.length > 0){
                if(hostUrl !== null){
                    if(businessExist[0].business_image_path  !== null ){
                        const link= businessExist[0].business_image_path.split('/').pop();
                        fs.unlinkSync('../../uploads/business-photos/'+link)
                    }
                }
            }

            UpdateBusinessDTO.groupId = 1;

            const status = commonStatus.Active
            const id =UpdateBusinessDTO.businessId;
            const checkBusinessType = await this.businessRepository.createQueryBuilder('business')
            .leftJoinAndSelect('business.businessType','businessType')
            .select([
                'business',
            ]).
            where('business.status IN (:status)',{status:status})
            .andWhere('business.id != :id',{id})
            .andWhere('business.userId IN (:userId)',{userId:UpdateBusinessDTO.userId})
            .andWhere('business.businessTypeId IN (:businessTypeId)',{businessTypeId : UpdateBusinessDTO.businessTypeId}).getOne()
            if(checkBusinessType){
                this.response.message = `Business type id = '${UpdateBusinessDTO.businessTypeId}' is already assign with user id ${UpdateBusinessDTO.userId}`
                this.response.status = "error";
                this.response.data = [];
                return this.response;
            }

            const user = await this.usersRepository.findOne({
                where : {id: UpdateBusinessDTO.userId}
            })
            payload.user = user;

            const businessType = await this.businessTypeRepository.findOne({
                where:{id: UpdateBusinessDTO.businessTypeId}
            })
            payload.businessType = businessType
            // console.log(payload);
            // return;
            const update = await this.businessRepository.save(payload);
            // console.log(update);
            this.response.status = 'success'
            this.response.data = update
            this.response.message='Business update successfully'
            return this.response;   
        } catch (error) {
            this.response.message = error.message;
            return this.response   
        }
    }

    async deleteBusiness(businessId:number){
        try {
            const update = this.businessRepository.update(businessId, {
                status:commonStatus.Delete
            });
            if(update){
                this.response.data = update,
                this.response.message = 'Business Delete Successfully'
                this.response.status = 'success'
                return this.response;
            }
            return this.response            
        } catch (error) {
            this.response.data = error.message
            return this.response;   
        }
    }

   async getAllBusinessType(req) {
        try{
            const host = req.headers.host;
            const proto = req.protocol;
            const imgLink =  `${proto}://${host}/uploads/business-types/`
            const allType = await this.businessTypeRepository.find()
            if(allType.length > 0){
                allType.forEach((business,index)=>{
                    business.image_path = imgLink + business.image_path
                });
            }
            this.response.data = allType,
            this.response.message = 'Business Type fetch Successfully'
            this.response.status = 'success'
            return this.response;
        }catch(error){
            this.response.message = error.message;
            return this.response;
        }
   }
}
