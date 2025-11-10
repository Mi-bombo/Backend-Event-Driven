import { Router } from "express";
import { crearLineaYRuta, editarLineaYRuta } from "../controllers/lineasRutasController";

export const lineaRutaRouter = Router();

lineaRutaRouter.post("/", crearLineaYRuta);
lineaRutaRouter.put("/:id", editarLineaYRuta);
