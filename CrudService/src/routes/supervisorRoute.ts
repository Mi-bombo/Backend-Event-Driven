import { Router } from "express";
import { supervisorController } from "../controllers/supervisorController";

export const supervisorRouter = Router();
const supervisorCtrl = new supervisorController();

supervisorRouter.get("/turnos-asignados", supervisorCtrl.getAllTurnosAsignados);
supervisorRouter.post("/asignar-turno/:id", supervisorCtrl.createTurnoPorDia);
supervisorRouter.put("/actualizar-turno/:id", supervisorCtrl.updateTurnoChofer);
supervisorRouter.delete("/eliminar-turno/:id", supervisorCtrl.deleteTurnoPorDia);
supervisorRouter.get("/catalogo-turnos", supervisorCtrl.getCatalogoTurnos);

supervisorRouter.get("/choferes", supervisorCtrl.getAllChoferes);
supervisorRouter.post("/crear-chofer", supervisorCtrl.createChofer);
supervisorRouter.get("/chofer/:id", supervisorCtrl.getChoferById);
supervisorRouter.put("/actualizar-chofer/:id", supervisorCtrl.updateChofer);
supervisorRouter.delete("/eliminar-chofer/:id", supervisorCtrl.deleteChofer);
