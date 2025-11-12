export interface ParadaCoords {
  coords: [number, number]; 
}

export interface CrearRutaRequest {
  nombre: string;
  descripcion?: string;
  trayecto: number[][][]; 
  paradas: ParadaCoords[];
  linea_id: number;
}

export type RutasQueryParams = {
  q?: string;
  page?: number;
  limit?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
};