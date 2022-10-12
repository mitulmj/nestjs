import { commonStatus } from "src/interface/comman-status";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Instant{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userId:number

    @Column()
    instantUserId:number

    @Column({default:1})
    groupId:number;

    @Column({type:'timestamp', default:()=> 'CURRENT_TIMESTAMP'})
    created_at : Date;

    @Column({type:'timestamp',default:()=> 'CURRENT_TIMESTAMP', onUpdate:'CURRENT_TIMESTAMP'})
    updated_at: Date;
}