import { IsEmail, IsNotEmpty,IsNumberString, IsString, MaxLength, MinLength } from 'class-validator';
export class UpdateUserDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsNotEmpty()
    @IsNumberString()
    @MaxLength(10)  
    @MinLength(10)
    phone_no:string;
}
