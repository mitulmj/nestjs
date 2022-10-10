import { Controller, Get, Param, Body, Post, Req, Delete,Patch, ParseIntPipe, UseInterceptors, UploadedFile, Headers, } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { multerOptions } from "src/multer-config";


@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    @Get()
    async getUser(){
        return this.userService.getUser();
       
    }

    @Post()
    @UseInterceptors(FileInterceptor('file',multerOptions))
    addUser(@Req() req:Request, @UploadedFile() file: Express.Multer.File,@Body() createuserDTO:CreateUserDTO){
        const host = req.headers.host;
        const proto = req.protocol;
        const uploadlink =  `${proto}://${host}/uploads/profile-photos/`
        file !== undefined ? createuserDTO.image_path = `${uploadlink}${file.filename}` : createuserDTO.image_path = null;
        return this.userService.create(createuserDTO);
    }

    @Patch('/:userId')
    @UseInterceptors(FileInterceptor('file',multerOptions))
    updateUser(
        @Req() req:Request,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateuserDTO:UpdateUserDTO, 
        @Param('userId',ParseIntPipe) userId: number){
            if(file === undefined){
                return this.userService.update(updateuserDTO,userId, null)
            }
            else{
                const host = req.headers.host;
                const proto = req.protocol;
                const uploadlink =  `${proto}://${host}/uploads/profile-photos/`
                file !== undefined ? updateuserDTO.image_path = `${uploadlink}${file.filename}` : updateuserDTO.image_path = null;
                return this.userService.update(updateuserDTO,userId, `${proto}://${host}`)
            }
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
    @UseInterceptors(FileInterceptor('file',multerOptions))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Headers() headers: Headers){
        console.log("origin",headers)
        return {
            "message": "something went wrong!"
        }
    }
}
