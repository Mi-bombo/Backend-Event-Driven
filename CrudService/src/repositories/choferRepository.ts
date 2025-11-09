import { pool } from "../db/db";

export class choferRepository {

  //! El chofer ve solo sus turnos asignados
    async getMisTurnos(id_user:number) {
    const { rows } = await pool.query(`
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

