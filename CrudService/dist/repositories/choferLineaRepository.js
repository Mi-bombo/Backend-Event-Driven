"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoferLineaRepository = void 0;
const db_1 = require("../db/db");
const BASE_SELECT = `
  SELECT 
    cl.id,
    cl.chofer_id,
    cl.linea_id,
    cl.estado,
    cl.fecha_asignacion,
    u.nombre AS chofer_nombre,
    u.email AS chofer_email,
    l.nombre AS linea_nombre,
    l.estado AS linea_estado
  FROM chofer_lineas cl
  JOIN usuarios u ON u.id = cl.chofer_id
  JOIN lineas l ON l.id = cl.linea_id
`;
const mapRow = (row) => ({
    id: row.id,
    chofer_id: row.chofer_id,
    linea_id: row.linea_id,
    estado: row.estado,
    fecha_asignacion: row.fecha_asignacion
        ? row.fecha_asignacion.toISOString()
        : null,
    chofer_nombre: row.chofer_nombre,
    chofer_email: row.chofer_email,
    linea_nombre: row.linea_nombre,
    linea_estado: row.linea_estado,
});
class ChoferLineaRepository {
    async listAssignments(filters = {}) {
        const where = ["u.rol_id = 2"];
        const values = [];
        let idx = 1;
        if (filters.choferId) {
            where.push(`cl.chofer_id = $${idx++}`);
            values.push(filters.choferId);
        }
        if (filters.lineaId) {
            where.push(`cl.linea_id = $${idx++}`);
            values.push(filters.lineaId);
        }
        if (filters.estado) {
            where.push(`cl.estado = $${idx++}`);
            values.push(filters.estado);
        }
        const query = `
      ${BASE_SELECT}
      WHERE ${where.join(" AND ")}
      ORDER BY cl.fecha_asignacion DESC NULLS LAST, cl.id DESC
    `;
        const { rows } = await db_1.pool.query(query, values);
        return rows.map(mapRow);
    }
    async getById(id) {
        const query = `
      ${BASE_SELECT}
      WHERE cl.id = $1 AND u.rol_id = 2
    `;
        const { rows } = await db_1.pool.query(query, [id]);
        return rows[0] ? mapRow(rows[0]) : null;
    }
    async findByChoferAndLinea(choferId, lineaId) {
        const { rows } = await db_1.pool.query(`${BASE_SELECT} WHERE cl.chofer_id = $1 AND cl.linea_id = $2 AND u.rol_id = 2`, [choferId, lineaId]);
        return rows[0] ? mapRow(rows[0]) : null;
    }
    async createAssignment(params) {
        const { choferId, lineaId, estado, fechaAsignacion } = params;
        const { rows } = await db_1.pool.query(`
      WITH inserted AS (
        INSERT INTO chofer_lineas (chofer_id, linea_id, estado, fecha_asignacion)
        VALUES ($1, $2, $3, COALESCE($4::timestamp, NOW()))
        RETURNING *
      )
      SELECT 
        i.id,
        i.chofer_id,
        i.linea_id,
        i.estado,
        i.fecha_asignacion,
        u.nombre AS chofer_nombre,
        u.email AS chofer_email,
        l.nombre AS linea_nombre,
        l.estado AS linea_estado
      FROM inserted i
      JOIN usuarios u ON u.id = i.chofer_id
      JOIN lineas l ON l.id = i.linea_id
      WHERE u.rol_id = 2
      `, [choferId, lineaId, estado, fechaAsignacion ?? null]);
        return rows[0] ? mapRow(rows[0]) : null;
    }
    async updateAssignment(params) {
        const { id, lineaId, estado } = params;
        const { rows } = await db_1.pool.query(`
      WITH updated AS (
        UPDATE chofer_lineas
        SET
          linea_id = COALESCE($2, linea_id),
          estado = COALESCE($3, estado)
        WHERE id = $1
        RETURNING *
      )
      SELECT 
        urow.id,
        urow.chofer_id,
        urow.linea_id,
        urow.estado,
        urow.fecha_asignacion,
        u.nombre AS chofer_nombre,
        u.email AS chofer_email,
        l.nombre AS linea_nombre,
        l.estado AS linea_estado
      FROM updated urow
      JOIN usuarios u ON u.id = urow.chofer_id
      JOIN lineas l ON l.id = urow.linea_id
      WHERE u.rol_id = 2
      `, [id, lineaId ?? null, estado ?? null]);
        return rows[0] ? mapRow(rows[0]) : null;
    }
    async deleteAssignment(id) {
        const { rows } = await db_1.pool.query(`
      WITH deleted AS (
        DELETE FROM chofer_lineas
        WHERE id = $1
        RETURNING *
      )
      SELECT 
        d.id,
        d.chofer_id,
        d.linea_id,
        d.estado,
        d.fecha_asignacion,
        u.nombre AS chofer_nombre,
        u.email AS chofer_email,
        l.nombre AS linea_nombre,
        l.estado AS linea_estado
      FROM deleted d
      JOIN usuarios u ON u.id = d.chofer_id
      JOIN lineas l ON l.id = d.linea_id
      WHERE u.rol_id = 2
      `, [id]);
        return rows[0] ? mapRow(rows[0]) : null;
    }
    async getChoferSummary(choferId) {
        const { rows } = await db_1.pool.query(`
        SELECT id, nombre, email, rol_id
        FROM usuarios
        WHERE id = $1 AND rol_id = 2
      `, [choferId]);
        return rows[0] || null;
    }
    async getLineaSummary(lineaId) {
        const { rows } = await db_1.pool.query(`
        SELECT id, nombre, estado
        FROM lineas
        WHERE id = $1
      `, [lineaId]);
        return rows[0] || null;
    }
}
exports.ChoferLineaRepository = ChoferLineaRepository;
