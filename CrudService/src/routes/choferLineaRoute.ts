import { Router } from "express";
import { ChoferLineaController } from "../controllers/choferLineaController";

const controller = new ChoferLineaController();

export const choferLineaRouter = Router();

choferLineaRouter.get("/", controller.list);
choferLineaRouter.get("/:id", controller.getById);
choferLineaRouter.post("/", controller.create);
choferLineaRouter.put("/:id", controller.update);
choferLineaRouter.delete("/:id", controller.delete);
