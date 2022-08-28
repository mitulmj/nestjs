import { Controller, Get, Param, Body, Post, Req, Delete,Patch, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import fs from 'fs';
import { diskStorage } from "multer";
import { extname } from "path";

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    @Get()
    getUser(){
        return this.userService.getUser();
    }

    @Post()
    addUser(@Body() createuserDTO:CreateUserDTO){
        return this.userService.create(createuserDTO);
    }

    @Patch('/:userId')
    updateUser(
        @Body() updateuserDTO:UpdateUserDTO, 
        @Param('userId',ParseIntPipe) userId: number){
        return this.userService.update(updateuserDTO,userId)
    }

    @Get('/:userId')
    getOneUser(@Param('userId',ParseIntPipe) userId: number){
        return this.userService.show(userId)
    } 

    @Get('detail/:userDetail')
    getUserByPhone(@Param('userDetail') userDetail:string){
        return this.userService.findByEmailOrPhoneOrId(userDetail);
    }

    @Delete('/:userId')
    deleteUser(@Param('userId',ParseIntPipe) userId: number){
        return this.userService.delete(userId)
    } 

    @Get('phone/:phoneNo')
    getUserByPhoneNo(@Param('phoneNo') phoneNo:string){
        return this.userService.byphoneNO(phoneNo);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination:'./uploads/profile-photos',
            filename:(req, file, cb)=>{
                const uniqSufix = Date.now() + '-'+ Math.round(Math.random()*1e9);
                const ext = extname(file.originalname);
                const filename = `${file.originalname}-${uniqSufix}-${ext}`;
                cb(null,filename);
            }
        })
    }))
    uploadFile(@UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1000000 }),
          ],
        }),
      ) file: Express.Multer.File){
        const path = "/upload/";
        console.log(file);
        //fs.createWriteStream(path).write(file.buffer);
        // return {
        //     file: file.buffer.toString(),
        //   };
    }
}
