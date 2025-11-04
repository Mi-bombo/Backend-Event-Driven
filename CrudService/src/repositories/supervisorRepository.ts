import { pool } from "../db/db.js";

export class supervisorRepository {
    
  //! Obtener un chofer por ID
  async getChoferById(id_user:number) {
    const { rows } = await pool.query(`
      SELECT id_user, nombre, apellido, email, telefono, dni, rol_id
      FROM usuario
      WHERE id_user = $1 AND rol_id = 2; -- 2 = chofer
    `, [id_user]);
    return rows[0] || null;
  }

  //! Crear un chofer
  async createChofer(nombre:string, email:string, password:string, rol_id:number) {
    const { rows } = await pool.query(`
      INSERT INTO usuario (nombre, email, password, rol_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id_user, nombre, email, telefono, dni, rol_id;
    `, [nombre, email, password, rol_id]);
    return rows[0];
  }

  //! Actualizar un chofer
  async updateChofer(nombre:string, email:string, password:string, rol_id:number, id_user:number) {
    const { rows } = await pool.query(`
      UPDATE usuario
      SET nombre = COALESCE($1, nombre),
          email = COALESCE($2, email),
          password = COALESCE($3, password),
          rol_id = COALESCE($4, rol_id)
      WHERE id_user = $5 AND rol_id = 2
      RETURNING id_user, nombre, apellido, email, telefono, dni, rol_id;
    `, [nombre, email, password, rol_id, id_user]);
    return rows[0] || null;
  }

  //! Eliminar un chofer
  async deleteChofer(id_user:number) {
    const { rows } = await pool.query(`
      DELETE FROM usuario
      WHERE id_user = $1 AND rol_id = 2
      RETURNING id_user, nombre, apellido, email;
    `, [id_user]);
    return rows[0] || null;
  }

//! Obtener todos los choferes
  async getAllChoferes() {
  const { rows } = await pool.query(`
    SELECT *
    FROM usuario
    WHERE rol_id = 2
    ORDER BY nombre;
  `);
  return rows;
}
}
