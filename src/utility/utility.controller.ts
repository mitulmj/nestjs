import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { UtilityService } from './utility.service';

@Controller('utility')
export class UtilityController {

    constructor(private readonly utilityService:UtilityService){

    }

    @Get('/:groupId')
    getAllUtility(@Param('groupId',ParseIntPipe) groupId: number,@Req() req) {
        return this.utilityService.getAllUtility(groupId,req)
    }

}
