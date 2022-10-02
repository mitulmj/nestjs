import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { jwtConstants } from './constant';
import { SignInDto } from './dto/signin.dto';
import { TokenEntity } from './entity/token.entity';
@Injectable()
export class AuthService {
    public response :{status:string,message:string,data:any}
    constructor(
        private userService: UserService,
        private jwtService : JwtService,
        private commonService : CommonService,
        @InjectRepository(TokenEntity)
        private readonly tokenRepository: Repository<TokenEntity>,
        @InjectRepository(User)
        private readonly userRepositoy : Repository<User>
        ){
         this.response={
            status:'error',
            message:'Opps! Something went wrong',
            data: [] as any,
         }
    }

    async signin(userData: SignInDto){
        this.response.status = 'error';
        this.response.data = [];
        try {
            const data = new SignInDto(userData)
            const validation = await this.commonService.validateData(data);
            if(validation.status === 'error'){
                this.response.message = validation.message;
                return this.response;
            }
            const verifyUser = await this.userRepositoy.findOne({
                where:{
                    email:data.email
                }
            })
            if(!verifyUser){
                this.response.message = 'Invalid email or password';
                return this.response;
            }
            const userPassword = await this.commonService.passwordEncrypt(
                data.password,
            );
            if (verifyUser.password !== userPassword) {
                this.response.message = 'Invalid email or password';
                return this.response;
            } 
            const payload: any = {
                id: verifyUser.id,
                name: verifyUser.name,
                email: verifyUser.email,
                status: 1,
            };
            const accessToken = this.jwtService.sign(payload,{
                secret:jwtConstants.secret
            })
            const insertToken = await this.insertToken(verifyUser.id,accessToken)
            if(insertToken){
                delete payload.status;
                payload.token = insertToken.token;
                payload.id = verifyUser.id,
                this.response.status = 'success',
                this.response.message = 'User Logged in Successfully';
                this.response.data = payload;
            }
            return this.response
        } catch (error) {
            this.response.message = error.message
            return this.response;
        }
    }

    async insertToken(userId: number, token: string) {
        const data = new TokenEntity();
        const checkExistToken = await this.tokenRepository.find({
          where: {
            userId: Number(userId),
            status: true,
          },
        });
        if (checkExistToken.length > 0) {
          checkExistToken.forEach((token) => {
            token.status = false;
            this.tokenRepository.save(token);
          });
        }
        data.userId = userId;
        data.token = token;
        
        
        return this.tokenRepository.save(data);
    }

    async validateToken(token: string) {
        this.response.status = 'error';
        this.response.data = [];
        try {
          const newToken = token.replace('Bearer ', '').trim();
          const token_data = await this.tokenRepository.findOne({
            where: {
              token: newToken,
            },
          });
          if (token_data.status === false) {
            this.response.message = 'Unathorized access.';
            return this.response;
          }
          this.response.status = 'success';
          this.response.message = 'Token validated successfully.';
          return this.response;
        } catch (err) {
          this.response.message = 'Unathorized access.';
          return this.response;
        }
    }

    async signout(token: string) {
        this.response.status = 'error';
        this.response.data = [];
        try {
          if (!token) {
            this.response.message = 'Unathorized access.';
            return this.response;
          }
          const tokenStr = token.replace('Bearer ', '').trim();
          const tokenData = await this.tokenRepository.findOne({
            where: {
              token: tokenStr,
              status: true,
            },
          });
          if (!tokenData) {
            this.response.message = 'Unathorized access';
            return this.response;
          }
          this.tokenRepository.update(tokenData.id, {
            status: false,
          });
          this.response.status = 'success';
          this.response.message = 'Token deleted successfully';
          return this.response;
        } catch (error) {
          this.response.message = 'Unathorized access';
          return this.response;
        }
    }

    // async validateUser(email:string,password:string){
    //     const user = await this.userService.findByEmail(email);
    //     if(user && user.password === password){
    //             return user;
    //     }
    //     throw new UnauthorizedException();
    // }

    // async login(user:any){
    //     const payload = {email:user.email, sub: user.id}
    //     return {
    //         access_token : this.jwtService.sign(payload)
    //     }
    // }
}
