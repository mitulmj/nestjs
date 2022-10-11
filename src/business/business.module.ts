import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entity/business.entity';
import { CommonService } from 'src/common/common.service';
import { User } from '../user/entity/user.entity';
import { BusinessTypes } from './entity/business_types.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Business,User,BusinessTypes])],
  providers: [BusinessService,CommonService],
  controllers: [BusinessController]
})
export class BusinessModule {}
