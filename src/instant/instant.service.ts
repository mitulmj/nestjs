import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { In, Repository } from 'typeorm';
import { addInstant } from './dto/addInstant.dto';
import { Instant } from './entity/instant.entity';

@Injectable()
export class InstantService {
    public response : {status: any, message:any, data:any };
    constructor(
        @InjectRepository(Instant)
        private instantRepository: Repository<Instant>,
        @InjectRepository(User)
        private userRepository : Repository<User>
    ){
        this.response = {
            status:'error',
            message : 'Opps. Somthing went wrong',
            data:[] as any,
        }
    }

    async getInstantByUserId(userId:number){
        try {
            let allUser = [];
            let newArr;
            const getAllInstant = await this.instantRepository.find({
                where:{userId:userId}
            })
            if(getAllInstant.length == 0){
                this.response.message = "No Instant found of user id: "+userId;
            }
            if(getAllInstant.length > 0){
                getAllInstant.forEach( (user) => {
                    allUser.push(user.instantUserId);
                })
                // console.log(allUser);
                const Instant = await this.userRepository.createQueryBuilder()
                .where("id IN(:ids)",{ids:allUser})

                const allInstant = await Instant.getMany();
                if(allInstant.length > 0){
                    newArr = allInstant.map(instant =>({
                    ...instant,instantId:getAllInstant.find(ginstat => ginstat.instantUserId === instant.id)
                    }))
                }
                this.response.status = "success";
                this.response.message = "Instant fetch success fully"
                this.response.data = newArr;
                return this.response;
            }
        } catch (error) {
            this.response.message = error.message;
            return this.response;
        }
    }

    async addInstant(addInstant:addInstant){
        try {
            if(addInstant.instantUserId.includes(addInstant.userId)){
                this.response.message = "You cant add own id into instant."
                return this.response;
            }
            const getInstant = await this.instantRepository.find({
                where:{userId:addInstant.userId}
            })
            let leftLength = 5 - getInstant.length;
            if(getInstant.length >= 5){
                this.response.message = "You can add Maximum 5 Instant User"
                return this.response
             }

            const isValidUser = await this.userRepository.find({
                where:{id:addInstant.userId}
            })
            if(isValidUser.length == 0){
                this.response.message = "User id is not valid"
                return this.response
            }
            const getInstantValidUser = await this.userRepository.find({
                where:{id:In([...addInstant.instantUserId])}
            })
            let validUser = getInstantValidUser.map(v => v.id)
            let notValidUsers = addInstant.instantUserId.filter(o => validUser.indexOf(o) === -1);
            
            if(notValidUsers.length > 0){
                this.response.message = "Instant id "+ [...notValidUsers] +" is not valid instant user id";
                return this.response
            }
            const Added = await this.instantRepository.find({
                where:{
                    userId:addInstant.userId,
                    instantUserId:In([...addInstant.instantUserId])
                }
            })
            let addedUser = Added.map(a => a.instantUserId);


            let notAddedUser = addInstant.instantUserId.filter((o) => addedUser.indexOf(o) === -1)
            notAddedUser =  notAddedUser.slice(0,leftLength);
            
            if(notAddedUser.length > 0){
                notAddedUser.forEach(async (addNew) => {
                    const instant = await this.instantRepository.save({
                        userId:addInstant.userId,
                        instantUserId:addNew,
                        groupId:addInstant.groupId
                    })
                })
                this.response.status = 'success'
                this.response.message = 'Instant added successfully.'
                this.response.data = [];
                return this.response; 
            } else{
                this.response.status = 'success'
                this.response.message = 'Instant added allready.'
                this.response.data = [];
                return this.response; 
            }
        } catch (error) {
            this.response.message = error.message
            return this.response
        }
    }

    async deleteInstant(instantId:number){
        try {
            const isExsit = await this.instantRepository.find({
                where:{id:instantId}
            })
            if(isExsit.length == 0){
                this.response.message = "No instant id found"
                return this.response
            }
            const deleted = await this.instantRepository.delete(instantId)
            this.response.status = "success"
            this.response.message= "Instant id is successfully deleted"
            return this.response
        } catch (error) {
            this.response.message = error.message;
            return this.response;
        }
    }
}
