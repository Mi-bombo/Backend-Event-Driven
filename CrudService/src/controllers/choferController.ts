import { ChoferService } from "../services/chofer.Service";
import { Request, Response } from "express";

export class choferController {
    choferService: ChoferService;
    constructor() {
        this.choferService = new ChoferService();
    }

    getMisTurnos = async (req: Request, res: Response): Promise<Response | void> => {
        try {
           const authHeader = req.headers['authorization'];

            const token = authHeader?.split(' ')[1];

            const result = await this.choferService.getMisTurnos(token!)
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error al obtener los turnos del chofer." });
        }
    }
}