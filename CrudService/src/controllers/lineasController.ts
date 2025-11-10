import { Request, Response } from "express";
import { LineaService } from "../services/lineas.service";
const svc = new LineaService();

export async function obtenerLineas(req: Request, res: Response): Promise<void> {
  const params = {
    q: req.query.q?.toString(),
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    estado: req.query.estado?.toString(),
  };
  try {
    const lineas = await svc.obtenerLineasService(params);
    res.json(lineas);
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}

export async function obtenerLineaConRutas(req: Request, res: Response): Promise<void> {
  const params = {
    q: req.query.q?.toString(),
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    estado: req.query.estado?.toString(),
  };
  try {
    const lineas = await svc.obtenerLineasConRutasService(params);
    res.json(lineas);
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}

export async function obtenerLineaPorId(req: Request, res: Response) {
  try {
    const linea = await svc.obtenerLineaPorId(Number(req.params.id));
    if (!linea) res.status(404).json({ error: "No encontrada" });
    else res.json(linea);
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) });
  }
}

