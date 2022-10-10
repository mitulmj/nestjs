import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entity/business.entity';
import { CommonService } from 'src/common/common.service';
import { User } from '../user/entity/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Business,User])],
  providers: [BusinessService,CommonService],
  controllers: [BusinessController]
})
export class BusinessModule {}
