import { token } from "morgan";
import { supervisorService } from "../services/supervisor.Service";
import { Request, Response } from "express";
import { create } from "domain";


export class supervisorController {
    supervisorService: supervisorService;
    constructor() {
        this.supervisorService = new supervisorService();
    }

    getAllTurnosAsignados = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];

            const token = authHeader?.split(' ')[1];
            const result = await this.supervisorService.getAllTurnosAsignados(token!);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error al obtener los turnos asignados." });
        }
    }

    //! Crear turno por día
    createTurnoPorDia = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];
            if (!token) return res.status(401).json({ error: "Token no enviado." });

            const {id_turno, dia } = req.body;
            const id_user = parseInt(req.params.id)
            console.log(id_user)
            const result = await this.supervisorService.createTurnoPorDia(id_user, id_turno, dia, token);
            return res.status(201).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al crear el turno." });
        }
    }

    //! Actualizar turno de chofer
    updateTurnoChofer = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token no enviado." });

    const id = Number(req.params.id);  // 👈 id del registro en turno_por_dia
    const { id_turno, dia } = req.body; // 👈 lo que querés actualizar

    const result = await this.supervisorService.updateTurnoChofer(id, id_turno, dia, token);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message || "Error al actualizar el turno." });
  }
};



    //! Eliminar turno asignado
    deleteTurnoPorDia = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];
            if (!token) return res.status(401).json({ error: "Token no enviado." });

            const id = parseInt(req.params.id);
           return await this.supervisorService.deleteTurnoPorDia(id, token);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al eliminar el turno." });
        }
    }

    //! ========== CHOFERES CRUD ==========

    //! Crear chofer
    createChofer = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { nombre, email, password, rol_id } = req.body;
            const result = await this.supervisorService.createChofer(nombre, email, password, rol_id);
            return res.status(201).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al crear el chofer." });
        }
    }

    //! Obtener todos los choferes
    getAllChoferes = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const result = await this.supervisorService.getAllChoferes();
            return res.status(200).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al obtener los choferes." });
        }
    }

    //! Obtener chofer por ID
    getChoferById = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const result = await this.supervisorService.getChoferById(Number(id));
            return res.status(200).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al obtener el chofer." });
        }
    }

    //! Actualizar chofer
    updateChofer = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const { nombre, email, password, rol_id } = req.body;
            const result = await this.supervisorService.updateChofer(Number(id), nombre, email, password, rol_id);
            return res.status(200).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al actualizar el chofer." });
        }
    }

    //! Eliminar chofer
    deleteChofer = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const result = await this.supervisorService.deleteChofer(Number(id));
            return res.status(200).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al eliminar el chofer." });
        }
    }
}

