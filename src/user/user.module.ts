import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UniqueEmailRule } from 'src/custom-validation/user/email-unique.validation';
import { CommonService } from 'src/common/common.service';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  providers: [UserService,UniqueEmailRule,CommonService],
  exports:[UserService],
  controllers: [UserController],
})
export class UserModule {}
