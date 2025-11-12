import { pool } from "../db/db";

export type ChoferLineaFilters = {
  choferId?: number;
  lineaId?: number;
  estado?: string;
};

export interface ChoferSummary {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
}

export interface LineaSummary {
  id: number;
  nombre: string;
  estado: string | null;
}

export interface ChoferLineaWithDetails {
  id: number;
  chofer_id: number;
  linea_id: number;
  estado: string;
  fecha_asignacion: string | null;
  chofer_nombre: string;
  chofer_email: string;
  linea_nombre: string;
  linea_estado: string | null;
}

type RawChoferLineaRow = {
  id: number;
  chofer_id: number;
  linea_id: number;
  estado: string;
  fecha_asignacion: Date | null;
  chofer_nombre: string;
  chofer_email: string;
  linea_nombre: string;
  linea_estado: string | null;
};

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
  FROM chofer_linea cl
  JOIN usuarios u ON u.id = cl.chofer_id
  JOIN lineas l ON l.id = cl.linea_id
`;

const mapRow = (row: RawChoferLineaRow): ChoferLineaWithDetails => ({
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

export class ChoferLineaRepository {
  async listAssignments(filters: ChoferLineaFilters = {}) {
    const where: string[] = ["u.rol_id = 2"];
    const values: Array<string | number> = [];
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

    const { rows } = await pool.query<RawChoferLineaRow>(query, values);
    return rows.map(mapRow);
  }

  async getById(id: number) {
    const query = `
      ${BASE_SELECT}
      WHERE cl.id = $1 AND u.rol_id = 2
    `;

    const { rows } = await pool.query<RawChoferLineaRow>(query, [id]);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async findByChoferAndLinea(choferId: number, lineaId: number) {
    const { rows } = await pool.query<RawChoferLineaRow>(
      `${BASE_SELECT} WHERE cl.chofer_id = $1 AND cl.linea_id = $2 AND u.rol_id = 2`,
      [choferId, lineaId]
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async createAssignment(params: {
    choferId: number;
    lineaId: number;
    estado: string;
    fechaAsignacion?: string;
  }) {
    const { choferId, lineaId, estado, fechaAsignacion } = params;
    const { rows } = await pool.query<RawChoferLineaRow>(
      `
      WITH inserted AS (
        INSERT INTO chofer_linea (chofer_id, linea_id, estado, fecha_asignacion)
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
      `,
      [choferId, lineaId, estado, fechaAsignacion ?? null]
    );

    return rows[0] ? mapRow(rows[0]) : null;
  }

  async updateAssignment(params: {
    id: number;
    lineaId?: number;
    estado?: string;
  }) {
    const { id, lineaId, estado } = params;
    const { rows } = await pool.query<RawChoferLineaRow>(
      `
      WITH updated AS (
        UPDATE chofer_linea
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
      `,
      [id, lineaId ?? null, estado ?? null]
    );

    return rows[0] ? mapRow(rows[0]) : null;
  }

  async deleteAssignment(id: number) {
    const { rows } = await pool.query<RawChoferLineaRow>(
      `
      WITH deleted AS (
        DELETE FROM chofer_linea
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
      `,
      [id]
    );

    return rows[0] ? mapRow(rows[0]) : null;
  }

  async getChoferSummary(choferId: number) {
    const { rows } = await pool.query<ChoferSummary>(
      `
        SELECT id, nombre, email, rol_id
        FROM usuarios
        WHERE id = $1 AND rol_id = 2
      `,
      [choferId]
    );
    return rows[0] || null;
  }

  async getLineaSummary(lineaId: number) {
    const { rows } = await pool.query<LineaSummary>(
      `
        SELECT id, nombre, estado
        FROM lineas
        WHERE id = $1
      `,
      [lineaId]
    );
    return rows[0] || null;
  }
}
