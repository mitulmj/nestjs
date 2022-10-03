import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, isURL, MaxLength, MinLength, Validate } from 'class-validator';

export class BusinessDTO {
    constructor(data? : Partial<BusinessDTO>){
        Object.assign(this,data)
    }

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

    
}