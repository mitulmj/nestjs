import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty,IsNumber,IsNumberString, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { UniqueEmailRule } from 'src/custom-validation/user/email-unique.validation';
export class UpdateUserDTO {

    constructor(data? : Partial<UpdateUserDTO>){
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
    // @Validate(UniqueEmailRule)
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

    @IsNumber()
    @Type(()=> Number)
    @IsNotEmpty({
        message:'Group id is required'
    })
    groupId:number
}
