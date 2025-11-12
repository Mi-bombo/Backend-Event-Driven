import { Router } from "express";
import { obtenerLineaConRutas, obtenerLineaPorId } from "../controllers/lineasController";

export const lineasRouter = Router();

lineasRouter.get("/", obtenerLineaConRutas);
lineasRouter.get("/:id", obtenerLineaPorId);
