import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { TokenEntity } from './entity/token.entity';
import { CommonService } from 'src/common/common.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports:[
        TypeOrmModule.forFeature([User,TokenEntity]),
        JwtModule.register({
            secret:jwtConstants.secret,
            signOptions:{expiresIn:'15 days'}
        })],
    controllers: [AuthController],
    providers: [AuthService,JwtStrategy,CommonService],
    exports:[AuthService]
})
export class AuthModule {}
