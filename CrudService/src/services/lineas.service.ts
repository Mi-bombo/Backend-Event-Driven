import { pool } from "../db/db";

export class LineaService {
  async obtenerLineasService(params: { q?: string, page?: number, limit?: number, estado?: string } = {}) {
    const { q = "", page = 1, limit = 15, estado } = params;
    const where: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (q) { where.push(`nombre ILIKE $${idx++}`); values.push(`%${q}%`); }
    if (estado) { where.push(`estado = $${idx++}`); values.push(estado); }
    values.push(limit, (page - 1) * limit);

    const sql = `
      SELECT *
      FROM lineas
      ${where.length ? " WHERE " + where.join(" AND ") : ""}
      ORDER BY fecha_creacion DESC
      LIMIT $${idx++} OFFSET $${idx}
    `;
    const { rows } = await pool.query(sql, values);
    return rows;
  }

  async obtenerLineasConRutasService(params: { q?: string, page?: number, limit?: number, estado?: string } = {}) {
  const { q = "", page = 1, limit = 15, estado } = params;
  const where: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (q) { where.push(`l.nombre ILIKE $${idx++}`); values.push(`%${q}%`); }
  if (estado) { where.push(`l.estado = $${idx++}`); values.push(estado); }
  values.push(limit, (page - 1) * limit);

  const sql = `
    SELECT l.*, r.id as ruta_id,
      r.nombre as ruta_nombre,
      r.descripcion as ruta_descripcion,
      ST_AsGeoJSON(r.geom) as trayecto,
      (
        SELECT json_agg(json_build_object('coords', ARRAY[ST_X(p.geom), ST_Y(p.geom)]))
        FROM paradas p
        JOIN linea_parada lp ON lp.parada_id = p.id
        WHERE lp.linea_id = l.id
      ) as paradas
    FROM lineas l
    LEFT JOIN rutas r ON r.linea_id = l.id
    ${where.length ? " WHERE " + where.join(" AND ") : ""}
    ORDER BY l.fecha_creacion DESC
    LIMIT $${idx++} OFFSET $${idx}
  `;
  const { rows } = await pool.query(sql, values);

  return rows.map(row => ({
    ...row,
    trayecto: row.trayecto ? JSON.parse(row.trayecto) : { type: 'MultiLineString', coordinates: [] },
    paradas: row.paradas || [],
  }));
}

async obtenerLineaPorId(id: number) {
  const { rows } = await pool.query(`
    SELECT l.*,
      r.id as ruta_id,
      r.nombre as ruta_nombre,
      r.descripcion as ruta_descripcion,
      ST_AsGeoJSON(r.geom) as trayecto,
      (
        SELECT json_agg(json_build_object('coords', ARRAY[ST_X(p.geom), ST_Y(p.geom)]))
        FROM paradas p
        JOIN linea_parada lp ON lp.parada_id = p.id
        WHERE lp.linea_id = l.id
      ) as paradas
    FROM lineas l
    LEFT JOIN rutas r ON r.linea_id = l.id
    WHERE l.id = $1
  `, [id]);
  const row = rows[0];
  if (!row) return { error: "No encontrada" };
  return {
    ...row,
    trayecto: row.trayecto ? JSON.parse(row.trayecto) : { type: 'MultiLineString', coordinates: [] },
    paradas: row.paradas || [],
  };
}
}
