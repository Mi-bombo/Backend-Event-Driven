import { Router } from "express";
import { choferController } from "../controllers/choferController";


export const choferRouter = Router();
const choferCtrl = new choferController();

choferRouter.get("/mis-turnos", choferCtrl.getMisTurnos);