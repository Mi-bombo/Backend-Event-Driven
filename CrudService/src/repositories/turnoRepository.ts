import { pool } from "../db/db";

export class turnoRepository {


  async getTurnoById(id_turno: number) {
    const { rows } = await pool.query(`SELECT turno FROM turnos WHERE id_turno = $1`, [id_turno]);
    return rows[0] || null;
}

  //! Supervisor ve todos los turnos asignados a los choferes
  async getAllTurnosAsignados() {
    const { rows } = await pool.query(`
      SELECT 
        tpd.id,
        u.id AS id_chofer,
        u.nombre AS nombre_chofer,
        t.turno AS nombre_turno,
        tpd.dia
      FROM turno_por_dia tpd
      JOIN turnos t ON tpd.id_turno = t.id_turno
      JOIN usuarios u ON tpd.id_user = u.id
      WHERE u.rol_id = 2 -- chofer
      ORDER BY tpd.dia, u.nombre;
    `);
    return rows || [];
  }

  //! Crear turno asignado a chofer
  async createTurnoPorDia(id_user:number, id_turno:number, dia:string) {
    const { rows } = await pool.query(`
      INSERT INTO turno_por_dia (id_user, id_turno, dia)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [id_user, id_turno, dia]);
    return rows[0];
  }

  //! Actualizar turno de un chofer en un día específico
  async updateTurnoChofer(id_user:number, dia:string, id_turno:number) {
    const { rows } = await pool.query(`
      UPDATE turno_por_dia
      SET id_turno = $1
      WHERE id_user = $2 AND dia = $3
      RETURNING *;
    `, [id_turno, id_user, dia]);
    return rows[0] || null;
  }

  //! Eliminar turno asignado
  async deleteTurnoPorDia(id:number) {
    const { rows } = await pool.query(`
      DELETE FROM turno_por_dia
      WHERE id = $1
      RETURNING *;
    `, [id]);
    return rows[0] || null;
  }
}

