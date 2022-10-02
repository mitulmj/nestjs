import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Not, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as fs from 'fs';

import { User } from './entity/user.entity';
import { resourceUsage } from 'process';
import { CommonService } from 'src/common/common.service';
import { commonStatus } from 'src/interface/comman-status';
import { group } from 'console';
@Injectable()
export class UserService {
    public response : {status: any, message:any, data:any };
    constructor(
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

    getUser() : Promise<User[]>{
        return this.usersRepository.find();
    }

    async create(createuserDTO:CreateUserDTO){
        try {
            const validate = await this.commonService.validateData(createuserDTO)
            if(validate.status === 'error'){
                this.response.message = validate.message
                return this.response
            }
            const emailExist = await this.usersRepository.find({
                where:{
                    email:createuserDTO.email,
                    groupId:createuserDTO.groupId
                }
            })
            //console.log(emailExist);
            if(emailExist.length > 0){
                this.response.data = []
                this.response.message = 'Email already exists.'

                return this.response;
            }
            const phoneExist = await this.usersRepository.find({
                where:{
                    phone_no:createuserDTO.phone_no,
                    groupId:createuserDTO.groupId
                }
            })
            if(phoneExist.length > 0){
                this.response.data = []
                this.response.message = 'Phone no already exists.'
                return this.response;
            }
            // now set static group id 1
            createuserDTO.groupId = 1;
            createuserDTO.password = String ( await this.commonService.md5String(createuserDTO.password))
            const user = await this.usersRepository.save(createuserDTO)
            this.response.status = 'success'
            this.response.message = 'User created successfully.'
            this.response.data.push(user);
            return this.response;    
        } catch (error) {
            this.response.data = error.message
            return this.response
        }
        
    }

    async update(updateuserDTO:UpdateUserDTO, userId:number, hostUrl){
        try {
            const validate = await this.commonService.validateData(updateuserDTO)
            if(validate.status === 'error'){
                this.response.message = validate.message
                return this.response
            }
            const usernotExist = await this.usersRepository.find({where:{id:userId}});
            if(usernotExist.length == 0){
                this.response.data = []
                this.response.message = 'User not found.'
                return this.response;
            }
            if(usernotExist.length >0 ){
                if(hostUrl !== null){
                    const link= usernotExist[0].image_path.split('/').pop();
                    fs.unlinkSync('./uploads/profile-photos/'+link)
                }
            }
    
            const emailExist = await this.usersRepository.find({where:{'email':updateuserDTO.email,'id':Not(userId)},})
            //console.log(emailExist);
            if(emailExist.length > 0){
                this.response.data = []
                this.response.message = 'Email already exists.'
    
                return this.response;
            }
            const phoneExist = await this.usersRepository.find({where:{'phone_no':updateuserDTO.phone_no,'id':Not(userId)}})
            if(phoneExist.length > 0){
                this.response.data = []
                this.response.message = 'Phone no already exists.'
                return this.response;
            }
            // now set static group id 1
            updateuserDTO.groupId = 1;
            updateuserDTO.password = String ( await this.commonService.md5String(updateuserDTO.password))
            const update = this.usersRepository.update(userId, updateuserDTO);
            this.response.status = 'success'
            this.response.data = update
            this.response.message='User update sucessfully'
            return this.response;   
        } catch (error) {
            this.response.data =  error.message
            return this.response
        }
    }

    async byphoneNO(phoneNo:string){
        try {
            const userDetail = await this.usersRepository.find({where:[{'phone_no':phoneNo}]})
            if(userDetail.length>0){
                this.response.message = 'Yes'
            }
            return this.response;    
        } catch (error) {
            this.response.data = error.message
            return this.response;
        }
    }

    async show(userId:number){       
        try {
            const user = await this.usersRepository.findOne({where : {'id': userId }});
            if(user){
                this.response.status = 'success'
                this.response.message = 'User fetch success-fully'
                this.response.data = user
            }
            return this.response
        } catch (error) {
            this.response.data = error.message
            return this.response
        }
    }

    async findByEmail(email:string){
        try {
            const user = await this.usersRepository.findOne({where: {'email': email}})
            if(user){
                this.response.status = 'success'
                this.response.message = 'User fetch success-fully'
                this.response.data = user
            }
            return this.response
        } catch (error) {
            this.response.data = error.message
            return this.response
        }
        
    }

    async findByEmailOrPhoneOrId(user:string){
        try {
            const userDetail = await this.usersRepository.find({
                where:[ {'email':user} , {'phone_no':user}]
            })
            if(userDetail.length>0){
                this.response.status = 'succuess'
                this.response.message = 'User fetched success fully'
                this.response.data = userDetail;
                return this.response;
            }
            if(typeof  +user === 'number'){
                const userDetailwithId = await this.usersRepository.find({
                    where:[{'id':+user}]
                })
                if(userDetailwithId.length > 0){
                    this.response.status = 'success'
                    this.response.message = 'User fetched Successfully'
                    this.response.data = userDetailwithId;
                    return this.response;
                }
            }
            return this.response;    
        } catch (error) {
            this.response.data = error.message
            return this.response
        }
        
    }

    async delete(userId:number){
        // this.usersRepository.delete(userId);
        try {
            const update = this.usersRepository.update(userId, {
                status:commonStatus.Delete
            });
            if(update){
                this.response.data = update,
                this.response.message = 'User Delete Success fully'
                this.response.status = 'success'
                return this.response;
            }
            return this.response            
        } catch (error) {
            this.response.data = error.message
            return this.response;   
        }
    }
}
