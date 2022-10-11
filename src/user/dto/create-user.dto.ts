import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, isURL, MaxLength, MinLength, Validate } from 'class-validator';
import { UniqueEmailRule } from 'src/custom-validation/user/email-unique.validation';

export class CreateUserDTO {
    constructor(data? : Partial<CreateUserDTO>){
        Object.assign(this,data)
    }

    @IsString()
    @IsNotEmpty({
        message:'Name is required'
    })
    name: string;

    @IsEmail()
    @IsNotEmpty({
        message:'Email is required'
    })
    @Validate(UniqueEmailRule)
    email: string

    @IsString()
    @IsNotEmpty({
        message:'password is required'
    })
    password:string;

    @IsNotEmpty({
        message:'phone no is required'
    })
    @IsNumberString()
    @MaxLength(10)  
    @MinLength(10)
    phone_no:string;

    image_path:string;

    @IsNotEmpty({
        message:'Group id is required'
    })
    @Type(()=> Number)
    @IsNumber()
    groupId:number

    @IsNotEmpty({
        message:'Device token is required',
    })
    device_token:string;
}