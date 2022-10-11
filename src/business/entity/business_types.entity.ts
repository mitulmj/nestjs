import { commonStatus } from "src/interface/comman-status";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class BusinessTypes{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    type_name:string;

    @Column()
    image_path:string

    @Column({type:'timestamp', default:()=> 'CURRENT_TIMESTAMP'})
    created_at : Date;

    @Column({type:'timestamp',default:()=> 'CURRENT_TIMESTAMP', onUpdate:'CURRENT_TIMESTAMP'})
    updated_at: Date;
}