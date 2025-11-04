import { Router } from "express";
import { supervisorController } from "../controllers/supervisorController";

export const supervisorRouter = Router();
const supervisorCtrl = new supervisorController();
supervisorRouter.get("/turnos-asignados", supervisorCtrl.getAllTurnosAsignados);