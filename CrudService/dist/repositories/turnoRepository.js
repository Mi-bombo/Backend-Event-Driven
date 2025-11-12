"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnoRepository = void 0;
const db_1 = require("../db/db");
class turnoRepository {
    async listCatalogoTurnos() {
        const { rows } = await db_1.pool.query(`
      SELECT id_turno AS id, turno AS nombre
      FROM turnos
      ORDER BY id_turno;
    `);
        return rows || [];
    }
    async getAllTurnosAsignados() {
        const { rows } = await db_1.pool.query(`
      SELECT 
        tpd.id,
        u.id AS id_user,
        u.nombre AS nombre_chofer,
        t.turno AS nombre_turno,
        -- Exponemos SIEMPRE como "fecha" en formato YYYY-MM-DD
        to_char(tpd.dia, 'YYYY-MM-DD') AS fecha
      FROM turno_por_dia tpd
      JOIN turnos t ON tpd.id_turno = t.id_turno
      JOIN usuarios u ON tpd.id_user = u.id
      WHERE u.rol_id = 2
      ORDER BY tpd.dia, u.nombre;
    `);
        return rows || [];
    }
    async createTurnoPorDia(id_user, id_turno, fechaISO) {
        const { rows } = await db_1.pool.query(`
      INSERT INTO turno_por_dia (id_user, id_turno, dia)
      VALUES ($1, $2, $3::date)
      RETURNING id, id_user, id_turno, to_char(dia, 'YYYY-MM-DD') AS fecha;
    `, [id_user, id_turno, fechaISO]);
        return rows[0];
    }
    async updateTurnoChofer(id, id_turno, fechaISO) {
        const { rows } = await db_1.pool.query(`
      UPDATE turno_por_dia
      SET id_turno = $1, dia = $2::date
      WHERE id = $3
      RETURNING id, id_user, id_turno, to_char(dia, 'YYYY-MM-DD') AS fecha;
    `, [id_turno, fechaISO, id]);
        return rows[0] || null;
    }
    async deleteTurnoPorDia(id) {
        const { rows } = await db_1.pool.query(`
      DELETE FROM turno_por_dia
      WHERE id = $1
      RETURNING id;
    `, [id]);
        return rows[0] || null;
    }
    async getTurnoPorDiaById(id) {
        const { rows } = await db_1.pool.query(`SELECT id, id_user, id_turno, to_char(dia, 'YYYY-MM-DD') AS fecha FROM turno_por_dia WHERE id = $1;`, [id]);
        return rows[0] || null;
    }
    async getTurnoById(id_turno) {
        const { rows } = await db_1.pool.query(`SELECT id_turno, turno FROM turnos WHERE id_turno = $1`, [id_turno]);
        return rows[0] || null;
    }
}
exports.turnoRepository = turnoRepository;
