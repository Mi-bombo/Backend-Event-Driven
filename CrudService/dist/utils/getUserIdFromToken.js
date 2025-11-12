"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromToken = getUserIdFromToken;
exports.getRoleIdFromToken = getRoleIdFromToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env/env");
function getUserIdFromToken(token) {
    if (!token)
        throw new Error("Token no enviado");
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.SECRET_KEY);
        const id = payload.userId;
        if (!id)
            throw new Error("Token inválido: falta userId");
        return id;
    }
    catch (error) {
        console.error("Error verificando token:", error);
        throw new Error("Token inválido o expirado");
    }
}
function getRoleIdFromToken(token) {
    if (!token)
        throw new Error("Token no enviado");
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.SECRET_KEY);
        console.log(payload);
        const rol_id = payload.rol_id;
        console.log("hola", rol_id);
        if (!rol_id)
            throw new Error("Token inválido: falta rol_id");
        return rol_id;
    }
    catch (error) {
        console.error("Error verificando token:", error);
        throw new Error("Token inválido o expirado");
    }
}
