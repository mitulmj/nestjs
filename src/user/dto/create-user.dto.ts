import { IsEmail, IsNotEmpty, IsNumberString, IsString, isURL, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsNotEmpty()
    @IsNumberString()
    @MaxLength(10)  
    @MinLength(10)
    phone_no:string;

    image_path:string;
}