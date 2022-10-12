import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { commonStatus } from 'src/interface/comman-status';
import { Repository } from 'typeorm';
import { Utility } from './entity/utility.entity';

@Injectable()
export class UtilityService {
    public response : {status: any, message:any, data:any };
    constructor(
        @InjectRepository(Utility)
        private utilityRepository: Repository<Utility>,
    ) {
        this.response = {
            status:'error',
            message : 'Opps. Somthing went wrong',
            data:[] as any,
        }
    }

   async getAllUtility(groupId:number,req) {
        try {
            const host = req.headers.host;
            const proto = req.protocol;
            const imgLink =  `${proto}://${host}/uploads/utility-types/`
            const allUtility = await this.utilityRepository.find({
                where:{groupId:groupId, status:commonStatus.Active}
            })
            if(allUtility.length == 0){
                this.response.message = 'No Utility Found'
                return this.response
            }
            if(allUtility.length > 0){
                allUtility.forEach((utility,index)=>{
                    utility.image_path = imgLink + utility.image_path
                });
            }
            this.response.status = "success";
            this.response.message = "Utility data succuess fully fetched"
            this.response.data = allUtility;
            return this.response
        } catch (error) {
            this.response.message = error.message
            return this.response;
        }
   }
}
