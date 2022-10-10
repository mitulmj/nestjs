import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity('tokens')
export class TokenEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userId:number;

    @Column()
    token:string

    @Column()
    device_token:string

    @Column({default:1})
    status:boolean

    @CreateDateColumn({type:'timestamp',default:()=>'CURRENT_TIMESTAMP'})
    created_at:Date

    @CreateDateColumn({
        type:'timestamp',
        default:()=>'CURRENT_TIMESTAMP',
        onUpdate:'CURRENT_TIMESTAMP',
    })
    updated_at:Date
}