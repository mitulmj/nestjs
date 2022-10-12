import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Post } from '@nestjs/common';
import { addInstant } from './dto/addInstant.dto';
import { InstantService } from './instant.service';

@Controller('instant')
export class InstantController {

    constructor(
        private readonly instantService: InstantService
    ){}

    @Get("/:userId")
    getInstantByUserId(@Param('userId',ParseIntPipe) userId:number){
        return this.instantService.getInstantByUserId(userId)
    }

    @Post("/addNew")
    addInstant(@Body() addInstant:addInstant){
        return this.instantService.addInstant(addInstant);
    }

    @Delete("/delete/:instantId")
    deleteInstant(@Param('instantId',ParseIntPipe) instantId:number){
        return this.instantService.deleteInstant(instantId)
    }

}
