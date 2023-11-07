import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: `.env.${process.env.NODE_ENV}` });

const { DB_HOST, DB_PORT, DB_USERNAME, DB_DATABASE, DB_PASSWORD } = process.env;

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    entities: [path.join(__dirname, '/../**/*.entity{.ts,.js}')],
    synchronize: false,
    logging: true,
};
