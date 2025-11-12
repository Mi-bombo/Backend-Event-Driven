"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalQueryRepository = void 0;
const db_1 = require("../db/db");
class generalQueryRepository {
    constructor() {
        this.returnAllItems = async (tabla) => {
            const result = await db_1.pool.query(`SELECT * FROM ${tabla}`);
            return result.rows || null;
        };
        this.deleteItemById = async (table, id) => {
            const result = await db_1.pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
            return result.rowCount > 0;
        };
        this.deleteItemByIdNumber = async (table, id) => {
            const result = await db_1.pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
            return result.rowCount > 0;
        };
    }
}
exports.generalQueryRepository = generalQueryRepository;
