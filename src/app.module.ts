import { Module , MiddlewareConsumer, NestModule,RequestMethod} from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user/entity/user.entity";
import database from './config/database.config'
import { AuthModule } from './auth/auth.module';
import { MulterModule } from "@nestjs/platform-express";
import { TokenEntity } from "./auth/entity/token.entity";
import { JwtService } from "@nestjs/jwt";
import { CommonService } from "./common/common.service";
import { AuthService } from "./auth/auth.service";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { BusinessModule } from './business/business.module';
import { Business } from "./business/entity/business.entity";
import { BusinessTypes } from "./business/entity/business_types.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot(database()),
        TypeOrmModule.forFeature([
            User,
            TokenEntity,
            Business,
            BusinessTypes,
        ]),
        UserModule,
        AuthModule,
        MulterModule.register({
            dest: './upload',
        }),
        BusinessModule
    ],
    controllers:[AppController],
    providers:[
        JwtService,
        CommonService,
        AuthService,
    ]
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .exclude(
            { path:'/user',method:RequestMethod.POST },
            { path:'/user/phone/:phoneNo',method:RequestMethod.GET},
           )
          .forRoutes(
            { path: '/auth/signout', method: RequestMethod.POST },
            { path: '/user', method: RequestMethod.GET },
            { path: '/user', method: RequestMethod.PATCH },
            { path: '/user', method: RequestMethod.DELETE },
            { path: '/user/*', method: RequestMethod.ALL },
            { path: '/business/',method:RequestMethod.ALL}
          );
      }
}