import { Controller, Get } from "@nestjs/common";


@Controller()
export class AppController{

    @Get()
    getUser(){
        return 'Now run on port 5000';
    }

}