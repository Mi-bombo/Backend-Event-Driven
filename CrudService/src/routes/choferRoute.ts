import { Router } from "express";
import { choferController } from "../controllers/choferController";
import { jwtValidator } from "../middlewares/jwtValidator";


export const choferRouter = Router();
const choferCtrl = new choferController();

choferRouter.get("/mis-turnos", jwtValidator.validarJwt, choferCtrl.getMisTurnos);