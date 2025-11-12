"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineaRutaRouter = void 0;
const express_1 = require("express");
const lineasRutasController_1 = require("../controllers/lineasRutasController");
exports.lineaRutaRouter = (0, express_1.Router)();
exports.lineaRutaRouter.post("/", lineasRutasController_1.crearLineaYRuta);
exports.lineaRutaRouter.put("/:id", lineasRutasController_1.editarLineaYRuta);
