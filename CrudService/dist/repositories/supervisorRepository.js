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
    async assignLineasToChofer(id_user, lineas) {
        const client = await db_1.pool.connect();
        try {
            await client.query("BEGIN");
            // Borra en ambas variantes de tabla por compatibilidad con esquemas previos
            await client.query(`DELETE FROM chofer_linea WHERE chofer_id = $1`, [id_user]).catch(() => { });
            await client.query(`DELETE FROM chofer_lineas WHERE chofer_id = $1`, [id_user]).catch(() => { });
            for (const lineaId of lineas) {
                // Intentar insertar en la tabla singular; si falla, intentar la plural
                try {
                    await client.query(`INSERT INTO chofer_linea (chofer_id, linea_id) VALUES ($1, $2)`, [id_user, lineaId]);
                }
                catch (insErr) {
                    await client.query(`INSERT INTO chofer_lineas (chofer_id, linea_id) VALUES ($1, $2)`, [id_user, lineaId]);
                }
            }
            await client.query("COMMIT");
            return true;
        }
        catch (e) {
            await client.query("ROLLBACK");
            throw e;
        }
        finally {
            client.release();
        }
    }
    async getLineasByChofer(id_user) {
        // Compatibilidad con ambas variantes de tabla: intentamos leer de cada una por separado
        const ids = new Set();
        try {
            const r1 = await db_1.pool.query(`SELECT linea_id FROM chofer_linea WHERE chofer_id = $1`, [id_user]);
            for (const row of r1.rows)
                ids.add(Number(row.linea_id));
        }
        catch (e) {
            // tabla singular no existe o error: ignoramos
        }
        try {
            const r2 = await db_1.pool.query(`SELECT linea_id FROM chofer_lineas WHERE chofer_id = $1`, [id_user]);
            for (const row of r2.rows)
                ids.add(Number(row.linea_id));
        }
        catch (e) {
            // tabla plural no existe o error: ignoramos
        }
        if (ids.size === 0)
            return [];
        const { rows } = await db_1.pool.query(`SELECT id, nombre FROM lineas WHERE id = ANY($1::int[]) ORDER BY nombre`, [Array.from(ids).map(Number)]);
        return rows || [];
    }
    async countTurnosByChofer(id_user) {
        const { rows } = await db_1.pool.query(`
      SELECT COUNT(*)::int AS cnt
      FROM turno_por_dia
      WHERE id_user = $1;
    `, [id_user]);
        return rows[0]?.cnt ?? 0;
    }
    async countChoferLineasByChofer(id_user) {
        // Intentar contar en cada variante por separado y sumar (evitar error si una tabla no existe)
        let sum = 0;
        try {
            const r1 = await db_1.pool.query(`SELECT COUNT(*)::int AS cnt FROM chofer_linea WHERE chofer_id = $1`, [id_user]);
            sum += Number(r1.rows[0]?.cnt ?? 0);
        }
        catch (e) {
            // tabla singular no existe o error: ignoramos
        }
        try {
            const r2 = await db_1.pool.query(`SELECT COUNT(*)::int AS cnt FROM chofer_lineas WHERE chofer_id = $1`, [id_user]);
            sum += Number(r2.rows[0]?.cnt ?? 0);
        }
        catch (e) {
            // tabla plural no existe o error: ignoramos
        }
        return sum;
    }
}
exports.supervisorRepository = supervisorRepository;
