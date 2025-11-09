import {Pool} from "pg"
import { DB_USER, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT } from "../env/env";


class pg {
    private static instance: pg
    private pool: Pool
    constructor(){
         this.pool = new Pool({
            user: DB_USER,
            host: DB_HOST,
            database: DB_DATABASE,
            password: DB_PASSWORD,
            port: DB_PORT ? parseInt(DB_PORT) : 5432,
            ssl: process.env.DB_SSL === 'true',

        });
    }

    public static getInstance(): pg {
        if (!pg.instance) {
            pg.instance = new pg();
        }
        return pg.instance;
    }

    public getPool(): Pool {
        return this.pool
    }
}

export const pool = pg.getInstance().getPool();
