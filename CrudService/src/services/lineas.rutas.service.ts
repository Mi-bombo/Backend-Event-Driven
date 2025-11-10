import { pool } from "../db/db";

export interface ParadaCoords {
  coords: [number, number];
}
export interface CrearLineaYRutaRequest {
  linea: {
    nombre: string;
    numero?: string;
    descripcion?: string;
    estado?: string;
  };
  ruta: {
    nombre: string;
    descripcion?: string;
    trayecto: number[][][];
    paradas: ParadaCoords[];
  };
}

export class LineaRutaService {
  async crearLineaYRutaService(data: CrearLineaYRutaRequest): Promise<{ lineaId: number, rutaId: number }> {
    const client = await pool.connect();
    console.log("data", data);
    try {
      await client.query("BEGIN");
      console.log("llegó aca tambien", data);
      console.log("data.linea", data.linea);

      const resLinea = await client.query(
        `INSERT INTO lineas (nombre, descripcion)
         VALUES ($1, $2)
         RETURNING id`,
        [data.linea.nombre, data.linea.descripcion || ""]
      );
      const lineaId = resLinea.rows[0].id;
      console.log("lineaId", lineaId);

      const trayectoWKT = `MULTILINESTRING(${data.ruta.trayecto
        .map(seg => `(${seg.map(([lon, lat]) => `${lon} ${lat}`).join(", ")})`).join(", ")})`;
      console.log("trayectoWKT", trayectoWKT);

      const resRuta = await client.query(
        `INSERT INTO rutas (linea_id, nombre, descripcion, geom, estado)
        VALUES ($1, $2, $3, ST_GeomFromText($4,4326), 'activo')
        RETURNING id`,
        [lineaId, data.ruta.nombre, data.ruta.descripcion || "", trayectoWKT]
      );

      const rutaId = resRuta.rows[0].id;

      for (let i = 0; i < data.ruta.paradas.length; i++) {
        const parada = data.ruta.paradas[i];
        const resP = await client.query(
          `INSERT INTO paradas (nombre, geom)
           VALUES ($1, ST_SetSRID(ST_MakePoint($2,$3),4326))
           RETURNING id`,
          [`Parada ${i + 1}`, parada.coords[0], parada.coords[1]]
        );
        await client.query(
          `INSERT INTO linea_parada (linea_id, parada_id, orden)
           VALUES ($1, $2, $3)`,
          [lineaId, resP.rows[0].id, i + 1]
        );
      }

      await client.query("COMMIT");
      return { lineaId, rutaId };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async editarLineaYRutaService(lineaId: number, data: CrearLineaYRutaRequest["linea"] & { ruta: CrearLineaYRutaRequest["ruta"], rutaId: number }): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `UPDATE lineas SET nombre=$2, descripcion=$3 WHERE id=$1`,
        [lineaId, data.nombre, data.descripcion || ""]
      );
      const trayectoWKT = `MULTILINESTRING(${data.ruta.trayecto
        .map(seg => `(${seg.map(([lon, lat]) => `${lon} ${lat}`).join(", ")})`).join(", ")})`;
      await client.query(
        `UPDATE rutas SET nombre=$2, descripcion=$3, geom=ST_GeomFromText($4,4326) WHERE id=$1 AND linea_id=$5`,
        [data.rutaId, data.ruta.nombre, data.ruta.descripcion || "", trayectoWKT, lineaId]
      );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
}
