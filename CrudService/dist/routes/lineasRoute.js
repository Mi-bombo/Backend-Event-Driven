"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineasRouter = void 0;
const express_1 = require("express");
const lineasController_1 = require("../controllers/lineasController");
exports.lineasRouter = (0, express_1.Router)();
exports.lineasRouter.get("/", lineasController_1.obtenerLineaConRutas);
exports.lineasRouter.get("/:id", lineasController_1.obtenerLineaPorId);
