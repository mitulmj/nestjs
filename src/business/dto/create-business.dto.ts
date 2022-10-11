import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, isURL, MaxLength, MinLength, Validate } from 'class-validator';

export class CreateBusinessDTO {
    constructor(data? : Partial<CreateBusinessDTO>){
        Object.assign(this,data)
    }

    @IsNotEmpty({
        message:'User id is required'
    })
    @Type(()=> Number)
    @IsNumber()
    userId: number;

    @IsNotEmpty({
        message:'Business Type id is required'
    })
    @Type(()=> Number)
    @IsNumber()
    businessTypeId: number;

    @IsNotEmpty({
        message:'Group id is required'
    })
    @Type(()=> Number)
    @IsNumber()
    groupId:number

    @IsString()
    @IsNotEmpty({
        message:'Business Name is required'
    })
    business_name: string;

    @IsString()
    @IsNotEmpty({
        message:'Business Address is required'
    })
    business_address: string;

    @IsNumberString()
    @MaxLength(10)  
    @MinLength(10)
    business_phone_no:string

    business_image_path:string;

}