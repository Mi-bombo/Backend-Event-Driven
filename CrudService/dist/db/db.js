"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("../env/env");
class pg {
    constructor() {
        this.pool = new pg_1.Pool({
            user: env_1.DB_USER,
            host: env_1.DB_HOST,
            database: env_1.DB_DATABASE,
            password: env_1.DB_PASSWORD,
            port: env_1.DB_PORT ? parseInt(env_1.DB_PORT) : 5432,
            ssl: process.env.DB_SSL === 'true',
        });
    }
    static getInstance() {
        if (!pg.instance) {
            pg.instance = new pg();
        }
        return pg.instance;
    }
    getPool() {
        return this.pool;
    }
}
exports.pool = pg.getInstance().getPool();
