import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Instant } from './entity/instant.entity';
import { InstantController } from './instant.controller';
import { InstantService } from './instant.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Instant,User]),
  ],
  controllers: [InstantController],
  providers: [InstantService]
})
export class InstantModule {}
