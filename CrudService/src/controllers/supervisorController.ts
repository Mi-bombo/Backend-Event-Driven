import { Request, Response } from "express";
import { supervisorService } from "../services/supervisor.Service";
import { sendEvent } from "../kafka/producer";

const svc = new supervisorService();

export class supervisorController {
  // Turnos
  getAllTurnosAsignados = async (_req: Request, res: Response) => {
    try {
      const data = await svc.listTurnosAsignados();
      res.json(data);
    } catch (e:any) {
      res.status(500).json({ error: e.message });
    }
  };

  createTurnoPorDia = async (req: Request, res: Response) => {
    try {
      const id_user = Number(req.params.id);
      const { id_turno, fecha } = req.body || {};
      const created = await svc.createTurnoPorDia(id_user, Number(id_turno), String(fecha));
      
      // Obtener el nombre del turno para enviar en el evento
      const turnoInfo = await svc.getTurnoInfo(Number(id_turno));
      
      // Enviar evento a Kafka con toda la información
      await sendEvent("turno-creado", {
        id: created.id,
        id_user: created.id_user,
        id_turno: created.id_turno,
        nombre_turno: turnoInfo?.turno || "Turno",
        dia: created.fecha,
        fecha: created.fecha
      });
      
      res.status(201).json(created);
    } catch (e:any) {
      res.status(500).json({ error: e.message });
    }
  };

  updateTurnoChofer = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { id_turno, fecha } = req.body || {};
      const updated = await svc.updateTurnoChofer(id, Number(id_turno), String(fecha));
      
      // Obtener el nombre del turno para enviar en el evento
      const turnoInfo = await svc.getTurnoInfo(Number(id_turno));
      
      // Enviar evento a Kafka
      await sendEvent("turno-actualizado", {
        id: updated.id,
        id_user: updated.id_user,
        id_turno: updated.id_turno,
        nombre_turno: turnoInfo?.turno || "Turno",
        dia: updated.fecha,
        fecha: updated.fecha
      });
      
      res.json(updated);
    } catch (e:any) {
      res.status(400).json({ error: e.message });
    }
  };

  deleteTurnoPorDia = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await svc.deleteTurnoPorDia(id);
      res.json({ ok: true });
    } catch (e:any) {
      res.status(500).json({ error: e.message });
    }
  };

  getCatalogoTurnos = async (_req: Request, res: Response) => {
    try {
      const data = await svc.listCatalogoTurnos();
      res.json(data);
    } catch (e:any) {
      res.status(500).json({ error: e.message });
    }
  };

  // Choferes
  getAllChoferes = async (_req: Request, res: Response) => {
    try {
      const data = await svc.getAllChoferes();
      res.json(data);
    } catch (e:any) {
      res.status(500).json({ error: e.message });
    }
  };

  createChofer = async (req: Request, res: Response) => {
    try {
      const { nombre, email, password } = req.body || {};
      const chofer = await svc.createChofer(nombre, email, password);
      res.status(201).json(chofer);
    } catch (e:any) {
      res.status(400).json({ error: e.message });
    }
  };

  getChoferById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const ch = await svc.getChoferById(id);
      res.json(ch);
    } catch (e:any) {
      res.status(404).json({ error: e.message });
    }
  };

  updateChofer = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nombre, email, password } = req.body || {};
      const ch = await svc.updateChofer(id, nombre, email, password);
      res.json(ch);
    } catch (e:any) {
      res.status(400).json({ error: e.message });
    }
  };

  deleteChofer = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await svc.deleteChofer(id);
      res.json({ ok: true });
    } catch (e:any) {
      res.status(400).json({ error: e.message });
    }
  };
}
