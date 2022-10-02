import { commonStatus } from "src/interface/comman-status";
import { userType } from "src/interface/user-type";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column()
    phone_no:string;

    @Column({nullable:true})
    image_path:string;

    @Column({default:1})
    groupId:number;

    @Column({type:'enum', enum:userType, default:userType.User})
    type:userType;

    @Column({type:'enum', enum:commonStatus, default:commonStatus.Active})
    status:commonStatus;

    @Column({type:'timestamp', default:()=> 'CURRENT_TIMESTAMP'})
    created_at : Date;

    @Column({type:'timestamp',default:()=> 'CURRENT_TIMESTAMP', onUpdate:'CURRENT_TIMESTAMP'})
    updated_at: Date;
}