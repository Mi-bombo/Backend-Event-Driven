import { token } from "morgan";
import { supervisorService } from "../services/supervisor.Service";
import { Request, Response } from "express";


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

            const { id_user, id_turno, dia } = req.body;
            const result = await this.supervisorService.createTurnoPorDia(id_user, id_turno, dia, token);
            return res.status(201).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al crear el turno." });
        }
    }

    //! Actualizar turno de chofer
    updateTurnoChofer = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];
            if (!token) return res.status(401).json({ error: "Token no enviado." });

            const { id_user, dia, id_turno } = req.body;
            const result = await this.supervisorService.updateTurnoChofer(id_user, dia, id_turno, token);
            return res.status(200).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al actualizar el turno." });
        }
    }

    //! Eliminar turno asignado
    deleteTurnoPorDia = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];
            if (!token) return res.status(401).json({ error: "Token no enviado." });

            const { id } = req.params;
            const result = await this.supervisorService.deleteTurnoPorDia(Number(id), token);
            return res.status(200).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al eliminar el turno." });
        }
    }

    getAllChoferes = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];
            if (!token) return res.status(401).json({ error: "Token no enviado." });
            const result = await this.supervisorService.getAllChoferes();
            return res.status(200).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Error al obtener los choferes." });
        }
    }
}