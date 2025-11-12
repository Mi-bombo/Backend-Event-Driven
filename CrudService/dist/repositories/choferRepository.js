"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choferRepository = void 0;
const db_1 = require("../db/db");
class choferRepository {
    async getMisTurnos(id_user) {
        const { rows } = await db_1.pool.query(`
      SELECT 
        tpd.id,
        t.turno AS nombre_turno,
        tpd.dia
      FROM turno_por_dia tpd
      JOIN turnos t ON tpd.id_turno = t.id_turno
      JOIN usuarios u ON tpd.id_user = u.id
      WHERE u.id = $1 AND u.rol_id = 2
      ORDER BY tpd.dia;
    `, [id_user]);
        return rows || [];
    }
}
exports.choferRepository = choferRepository;
