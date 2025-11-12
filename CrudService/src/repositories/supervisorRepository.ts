import { pool } from "../db/db";

export class supervisorRepository {
  async getChoferById(id_user:number) {
    const { rows } = await pool.query(`
      SELECT id, nombre, apellido, email, telefono, dni, rol_id
      FROM usuarios
      WHERE id = $1 AND rol_id = 2;
    `, [id_user]);
    return rows[0] || null;
  }

  async createChofer(nombre:string, email:string, passwordHash:string, rol_id:number) {
    const { rows } = await pool.query(`
      INSERT INTO usuarios (nombre, email, password_hash, rol_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, email, rol_id;
    `, [nombre, email, passwordHash, rol_id]);
    return rows[0];
  }

  async updateChofer(
    nombre: string | null,
    email: string | null,
    passwordHash: string | null,
    rol_id: number | null,
    id_user: number
  ) {
    const { rows } = await pool.query(`
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

  async deleteChofer(id_user:number) {
    const { rows } = await pool.query(`
      DELETE FROM usuarios
      WHERE id = $1 AND rol_id = 2
      RETURNING id, nombre, email;
    `, [id_user]);
    return rows[0] || null;
  }

  async getAllChoferes() {
    const { rows } = await pool.query(`
      SELECT id, nombre, email, rol_id
      FROM usuarios
      WHERE rol_id = 2
      ORDER BY nombre;
    `);
    return rows;
  }
}
