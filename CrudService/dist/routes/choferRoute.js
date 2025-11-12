"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choferRouter = void 0;
const express_1 = require("express");
const choferController_1 = require("../controllers/choferController");
const jwtValidator_1 = require("../middlewares/jwtValidator");
exports.choferRouter = (0, express_1.Router)();
const choferCtrl = new choferController_1.choferController();
exports.choferRouter.get("/mis-turnos", jwtValidator_1.jwtValidator.validarJwt, choferCtrl.getMisTurnos);
