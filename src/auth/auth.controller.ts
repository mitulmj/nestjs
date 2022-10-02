import { Request, Controller, Post, Headers, UseGuards, Body  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor (private authService:AuthService){

    }
   
    @Post('/signin')
    async login(@Body() signData:SignInDto){ 
       return this.authService.signin(signData);
    }

    @Post('/signout')
    async signout(@Headers('authorization') token: string) {
      return this.authService.signout(token);
    }
}
