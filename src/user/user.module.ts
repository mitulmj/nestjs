import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UniqueEmailRule } from 'src/custom-validation/user/email-unique.validation';
import { CommonService } from 'src/common/common.service';
import { TokenEntity } from 'src/auth/entity/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constant';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,TokenEntity]),
    AuthModule,
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions:{expiresIn:'15 days'}
    }),
  ],
  providers: [UserService,UniqueEmailRule,CommonService,AuthService,JwtStrategy],
  exports:[UserService],
  controllers: [UserController],
})
export class UserModule {}
