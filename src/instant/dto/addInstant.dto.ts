import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, isURL, MaxLength, MinLength, Validate } from 'class-validator';
import { UniqueEmailRule } from 'src/custom-validation/user/email-unique.validation';

export class addInstant {
    constructor(data? : Partial<addInstant>){
        Object.assign(this,data)
    }

    @IsNotEmpty({
        message:'User id is required'
    })
    @Type(()=> Number)
    @IsNumber()
    userId:number

    @IsNotEmpty({
        message:'Instant id is required'
    })
    @Type(()=> Number)
    @IsNumber()
    instantUserId:number

    @IsNotEmpty({
        message:'Group id is required'
    })
    @Type(()=> Number)
    @IsNumber()
    groupId:number
}