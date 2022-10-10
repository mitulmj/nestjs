import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  constructor(data?: Partial<SignInDto>) {
    Object.assign(this, data);
  }

  @IsEmail()
  @IsNotEmpty({
    message: 'Email-id is required',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;

  @IsNotEmpty({
    message:'Device token is required',
  })
  device_token:string;
}
