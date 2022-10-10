import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength, MinLength} from 'class-validator';

export class UpdateBusinessDTO {
    constructor(data? : Partial<UpdateBusinessDTO>){
        Object.assign(this,data)
    }
    
    @IsNotEmpty({
        message:'Business id is required'
    })
    @Type(()=> Number)
    @IsNumber()
    businessId: number;

    @IsNotEmpty({
        message:'User id is required'
    })
    @Type(()=> Number)
    @IsNumber()
    userId: number;

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