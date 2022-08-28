import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user/entity/user.entity";
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from "@nestjs/platform-express";

@Module({
    imports: [UserModule,
            TypeOrmModule.forRoot({
                type: 'mysql',
                host: '127.0.0.1',
                port: 3306,
                username: 'root',
                password: null,
                database: 'tatsam',
                entities: [User],
                synchronize: true,
          }),
            AuthModule,
            MulterModule.register({
                dest: './upload',
            })
        ],
    controllers:[AppController],
})
export class AppModule{}