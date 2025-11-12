"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choferController = void 0;
const chofer_Service_1 = require("../services/chofer.Service");
class choferController {
    constructor() {
        this.getMisTurnos = async (req, res) => {
            try {
                if (!req.user || !req.user.id) {
                    return res.status(401).json({ error: "Usuario no autenticado" });
                }
                const result = await this.choferService.getMisTurnosByUserId(req.user.id);
                return res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: "Error al obtener los turnos del chofer." });
            }
        };
        this.choferService = new chofer_Service_1.ChoferService();
    }
}
exports.choferController = choferController;
