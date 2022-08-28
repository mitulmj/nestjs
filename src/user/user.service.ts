import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Not, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

import { User } from './entity/user.entity';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
      ) {}

    getUser() : Promise<User[]>{
        return this.usersRepository.find();
    }

    async create(createuserDTO:CreateUserDTO){
        //return createuserDTO;
        const response = {
            status:200,
            message:'Ops! Something went wrong.',
            data:[],
        }
        const emailExist = await this.usersRepository.findBy({email:createuserDTO.email})
        //console.log(emailExist);
        if(emailExist.length > 0){
            response.data = []
            response.message = 'Email already exists.'

            return response;
        }
        const phoneExist = await this.usersRepository.findBy({phone_no:createuserDTO.phone_no})
        if(phoneExist.length > 0){
            response.data = []
            response.message = 'Phone no already exists.'
            return response;
        }
        const user = await this.usersRepository.save(createuserDTO)
        response.message = 'User created successfully.'
        response.data.push(user);
        return response;
    }

    async update(updateuserDTO:UpdateUserDTO, userId:number){
        const response = {
            status:200,
            message:'Ops! Something went wrong.',
            data:[],
        }
        const usernotExist = await this.usersRepository.find({where:{id:userId}});
        if(usernotExist.length == 0){
            response.data = []
            response.message = 'User not found.'
            return response;
        }
        const emailExist = await this.usersRepository.find({where:{'email':updateuserDTO.email,'id':Not(userId)},})
        //console.log(emailExist);
        if(emailExist.length > 0){
            response.data = []
            response.message = 'Email already exists.'

            return response;
        }
        const phoneExist = await this.usersRepository.find({where:{'phone_no':updateuserDTO.phone_no,'id':Not(userId)}})
        if(phoneExist.length > 0){
            response.data = []
            response.message = 'Phone no already exists.'
            return response;
        }
        const update = this.usersRepository.update(userId, updateuserDTO);
        response.data.push(update)
        response.message='User update sucessfully'
        return response;
    }

    async byphoneNO(phoneNo:string){
        const response = {
            status:200,
            message:'No',
        }
        const userDetail = await this.usersRepository.find({where:[{'phone_no':phoneNo}]})
        if(userDetail.length>0){
            response.message = 'Yes'
        }
        return response;
    }

    show(userId:number){
        return this.usersRepository.findOne({where : {'id': userId }});
    }

    findByEmail(email:string){
        return this.usersRepository.findOne({where: {'email': email}})
    }

    async findByEmailOrPhoneOrId(user:string){
        const response = {
            status:200,
            message:'Ops! Something went wrong.',
            data:[],
        }
        const userDetail = await this.usersRepository.find(
            {where:[ {'email':user} , {'phone_no':user}]})
        if(userDetail.length>0){
            response.message = 'User fetched Successfully'
            response.data = userDetail;
            return response;
        }
        const userDetailwithId = await this.usersRepository.find({where:[{'id':+user}]})
        if(userDetailwithId.length > 0){
            response.message = 'User fetched Successfully'
            response.data = userDetailwithId;
            return response;
        }
        return response;
    }

    delete(userId:number){
        return this.usersRepository.delete(userId);
    }
}
