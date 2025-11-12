import { ChoferService } from "../services/chofer.Service";
import { Request, Response } from "express";

export class choferController {
    choferService: ChoferService;
    constructor() {
        this.choferService = new ChoferService();
    }

    getMisTurnos = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            const result = await this.choferService.getMisTurnosByUserId(req.user.id);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error al obtener los turnos del chofer." });
        }
    }
}