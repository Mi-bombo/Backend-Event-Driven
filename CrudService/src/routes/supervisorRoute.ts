import { Router } from "express";
import { supervisorController } from "../controllers/supervisorController";

export const supervisorRouter = Router();
const supervisorCtrl = new supervisorController();
supervisorRouter.get("/turnos-asignados", supervisorCtrl.getAllTurnosAsignados);
supervisorRouter.post("/asignar-turno/:id", supervisorCtrl.createTurnoPorDia);
supervisorRouter.put("/actualizar-turno/:id", supervisorCtrl.updateTurnoChofer);
supervisorRouter.delete("/eliminar-turno/:id", supervisorCtrl.deleteTurnoPorDia);
supervisorRouter.get("/choferes", supervisorCtrl.getAllChoferes);