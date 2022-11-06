import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { BusinessmulterOptions } from './business-multer.config';
import { BusinessService } from './business.service';
import { BusinessDTO } from './dto/business.dto';
import { CreateBusinessDTO } from './dto/create-business.dto';
import { UpdateBusinessDTO } from './dto/update-business.dto';

@Controller('business')
export class BusinessController {
    constructor(
        private businessService: BusinessService
    ){}

    @Get("/businesstype")
    getAllbusinessType(@Req() req:Request){
        return this.businessService.getAllBusinessType(req);
    }

    @Get('/:groupId')
    async getAllBusiness(@Param('groupId',ParseIntPipe) groupId: number,@Req() req){
        return await this.businessService.getAllBusiness(groupId,req)
    }

    @Post('/getmy')
    async getMyBusiness(@Req() req:Request,@Body() BusinessDTO:BusinessDTO){
        return await this.businessService.getMyBusiness(req,BusinessDTO)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file',BusinessmulterOptions))
    addUser(@Req() req:Request, @UploadedFile() file: Express.Multer.File,@Body() CreateBusinessDTO:CreateBusinessDTO){
        const host = req.headers.host;
        const proto = req.protocol;
        const uploadlink =  `${proto}://${host}/uploads/business-photos/`
        file !== undefined ? CreateBusinessDTO.business_image_path = `${uploadlink}${file.filename}` : CreateBusinessDTO.business_image_path = null;
        return this.businessService.createBusiness(CreateBusinessDTO);
    }


    @Patch()
    @UseInterceptors(FileInterceptor('file',BusinessmulterOptions))
    updateUser(
        @Req() req:Request,
        @UploadedFile() file: Express.Multer.File,
        @Body() UpdateBusinessDTO:UpdateBusinessDTO, 
       ){
            if(file === undefined || file == null){
                return this.businessService.updateBusiness(UpdateBusinessDTO, null)
            }
            else{
                const host = req.headers.host;
                const proto = req.protocol;
                const uploadlink =  `${proto}://${host}/uploads/business-photos/`
                file !== undefined ? UpdateBusinessDTO.business_image_path = `${uploadlink}${file.filename}` : UpdateBusinessDTO.business_image_path = null;
                return this.businessService.updateBusiness(UpdateBusinessDTO,`${proto}://${host}`)
            }
    }

    @Delete('/:businessId')
    deleteUser(@Param('businessId',ParseIntPipe) businessId: number){
        return this.businessService.deleteBusiness(businessId)
    } 

}
