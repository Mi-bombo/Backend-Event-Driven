"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supervisorRepository = void 0;
const db_1 = require("../db/db");
class supervisorRepository {
    async getChoferById(id_user) {
        const { rows } = await db_1.pool.query(`
      SELECT id, nombre, apellido, email, telefono, dni, rol_id
      FROM usuarios
      WHERE id = $1 AND rol_id = 2;
    `, [id_user]);
        return rows[0] || null;
    }
    async createChofer(nombre, email, passwordHash, rol_id) {
        const { rows } = await db_1.pool.query(`
      INSERT INTO usuarios (nombre, email, password_hash, rol_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, email, rol_id;
    `, [nombre, email, passwordHash, rol_id]);
        return rows[0];
    }
    async updateChofer(nombre, email, passwordHash, rol_id, id_user) {
        const { rows } = await db_1.pool.query(`
      UPDATE usuarios
      SET nombre        = COALESCE($1, nombre),
          email         = COALESCE($2, email),
          password_hash = COALESCE($3, password_hash),
          rol_id        = COALESCE($4, rol_id)
      WHERE id = $5 AND rol_id = 2
      RETURNING id, nombre, email, rol_id;
    `, [nombre, email, passwordHash, rol_id, id_user]);
        return rows[0] || null;
    }
    async deleteChofer(id_user) {
        const { rows } = await db_1.pool.query(`
      DELETE FROM usuarios
      WHERE id = $1 AND rol_id = 2
      RETURNING id, nombre, email;
    `, [id_user]);
        return rows[0] || null;
    }
    async getAllChoferes() {
        const { rows } = await db_1.pool.query(`
      SELECT id, nombre, email, rol_id
      FROM usuarios
      WHERE rol_id = 2
      ORDER BY nombre;
    `);
        return rows;
    }
}
exports.supervisorRepository = supervisorRepository;
