import { Request, Response } from "express";
import { LineaRutaService, CrearLineaYRutaRequest } from "../services/lineas.rutas.service";
const svc = new LineaRutaService();

export async function crearLineaYRuta(req: Request, res: Response): Promise<void> {
  console.log(req.body);
  try {
    const result = await svc.crearLineaYRutaService(req.body as CrearLineaYRutaRequest);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}

export async function editarLineaYRuta(req: Request, res: Response): Promise<void> {
  try {
    await svc.editarLineaYRutaService(Number(req.params.id), req.body);
    res.sendStatus(204);
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}
