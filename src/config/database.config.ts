import { TypeOrmModuleOptions } from '@nestjs/typeorm';


const database = ():TypeOrmModuleOptions =>{
    return{
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: null,
        database: 'tatsam',
        synchronize: true,
        autoLoadEntities: true,
    }
}

export default database;