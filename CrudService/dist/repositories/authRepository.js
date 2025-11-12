"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const db_1 = require("../db/db");
const dbRepository_1 = require("./dbRepository");
class authRepository {
    constructor() {
        this.getUserForId = async (id) => {
            const result = await db_1.pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id]);
            return result.rows[0] || null;
        };
        this.getUserForEmail = async (email) => {
            const result = await db_1.pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
            return result.rows[0] || null;
        };
        this.deleteUserById = async (id) => {
            await this.generalQueryRepo.deleteItemById('usuarios', id);
        };
        this.getItemById = async (id, algo) => {
            return await db_1.pool.query(`SELECT * FROM ${algo} WHERE id = $1`, [id]);
        };
        this.getItemByIdNumber = async (id, algo) => {
            return await db_1.pool.query(`SELECT * FROM ${algo} WHERE id = $1`, [id]);
        };
        this.generalQueryRepo = new dbRepository_1.generalQueryRepository();
    }
}
exports.authRepository = authRepository;
