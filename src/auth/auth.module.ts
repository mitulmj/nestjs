import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';

@Module({
    controllers: [AuthController],
    imports:[UserModule,PassportModule,
    JwtModule.register({
        secret:jwtConstants.secret,
        signOptions:{expiresIn:'60s'}
    })],
    providers: [AuthService,LocalStrategy],
})
export class AuthModule {}
