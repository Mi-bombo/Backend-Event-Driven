"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifRepository = void 0;
const db_1 = require("../db/db");
class notifRepository {
    async getUsersEmail() {
        const result = await db_1.pool.query('SELECT email from usuarios');
        return result.rows ?? [];
    }
    async getUserById(id) {
        const result = await db_1.pool.query('SELECT * from usuarios where id = $1', [id]);
        return result.rows[0] ?? null;
    }
}
exports.notifRepository = notifRepository;
