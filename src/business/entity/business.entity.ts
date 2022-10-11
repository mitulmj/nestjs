import { commonStatus } from "src/interface/comman-status";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { BusinessTypes } from "./business_types.entity";

@Entity()
export class Business{

    constructor(data?: Partial<Business>) {
        Object.assign(this, data);
      }

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>User, (user)=> user.id)
    @JoinColumn()
    user:User

    @OneToOne(()=>BusinessTypes, (businessType)=> businessType.id)
    @JoinColumn()
    businessType:BusinessTypes

    @Column({default:1})
    groupId:number;

    @Column()
    business_name:string;

    @Column()
    business_address:string

    @Column({nullable:true})
    business_phone_no:string;

    @Column({nullable:true})
    business_image_path:string;

    @Column({type:'enum', enum:commonStatus, default:commonStatus.Active})
    status:commonStatus;

    @Column({type:'timestamp', default:()=> 'CURRENT_TIMESTAMP'})
    created_at : Date;

    @Column({type:'timestamp',default:()=> 'CURRENT_TIMESTAMP', onUpdate:'CURRENT_TIMESTAMP'})
    updated_at: Date;
}