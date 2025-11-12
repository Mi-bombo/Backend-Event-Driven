import { Request, Response } from "express";
import { ChoferLineaService } from "../services/choferLinea.service";
import { isHttpError } from "../utils/httpError";
import { sendEvent } from "../kafka/producer";

const service = new ChoferLineaService();

const handleError = (error: unknown, res: Response) => {
  if (isHttpError(error)) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  console.error("Error en ChoferLineaController:", error);
  return res
    .status(500)
    .json({ error: "Ocurrió un error inesperado en el servidor." });
};

export class ChoferLineaController {
  list = async (req: Request, res: Response) => {
    try {
      const filters = {
        choferId: req.query.choferId ? Number(req.query.choferId) : undefined,
        lineaId: req.query.lineaId ? Number(req.query.lineaId) : undefined,
        estado: req.query.estado?.toString(),
      };
      const assignments = await service.list(filters);
      res.json(assignments);
    } catch (error) {
      handleError(error, res);
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const assignment = await service.getById(Number(req.params.id));
      res.json(assignment);
    } catch (error) {
      handleError(error, res);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const assignment = await service.create({
        chofer_id: req.body?.chofer_id,
        linea_id: req.body?.linea_id,
        estado: req.body?.estado,
        fecha_asignacion: req.body?.fecha_asignacion,
      });

      await sendEvent("chofer-linea-asignada", assignment);
      res.status(201).json(assignment);
    } catch (error) {
      handleError(error, res);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const assignment = await service.update(Number(req.params.id), {
        linea_id: req.body?.linea_id,
        estado: req.body?.estado,
      });

      await sendEvent("chofer-linea-actualizada", assignment);
      res.json(assignment);
    } catch (error) {
      handleError(error, res);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const deleted = await service.delete(Number(req.params.id));
      await sendEvent("chofer-linea-eliminada", deleted);
      res.json({ ok: true, data: deleted });
    } catch (error) {
      handleError(error, res);
    }
  };
}
