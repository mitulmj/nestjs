import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { commonStatus } from "src/interface/comman-status";
import { User } from "src/user/entity/user.entity";
import { Not, Repository } from "typeorm";

@ValidatorConstraint({name:'UniqueEmail',async:true})
@Injectable()
export class UniqueEmailRule implements ValidatorConstraintInterface{
    constructor (
        @InjectRepository(User)
        private userRepository :Repository<User>
    ){ }

    async validate(email: string, args?: ValidationArguments) {
        if(args.object['user']){
            const userId = args.object['user'];
            const isUnique = await this.userRepository.findOne({
                where:{
                    id:Not(userId),
                    email:email,
                    status:Not(commonStatus.Delete)
                }
            })
            // console.log('if isUnique',isUnique);
            
            return isUnique ? false : true 
        }else{
            const isUnique = await this.userRepository.findOne({
                where:{
                    email:email,
                    status:Not(commonStatus.Delete)
                }
            })
            // console.log('else isUnique',isUnique);
            return isUnique ? false : true
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Email Already exist.';
    }
}