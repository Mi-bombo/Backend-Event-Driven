"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtValidator = void 0;
const env_1 = require("../env/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
class jwtValidator {
}
exports.jwtValidator = jwtValidator;
_a = jwtValidator;
jwtValidator.createJwt = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const payLoad = { userId };
            jsonwebtoken_1.default.sign(payLoad, env_1.SECRET_KEY, {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) {
                    reject('No se pudo generar el token');
                }
                else {
                    resolve(token);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
};
jwtValidator.validarJwt = async (req, res, next) => {
    try {
        let token = null;
        const authHeader = req.headers['authorization'];
        console.log(authHeader);
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log("aca", token);
        }
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) {
            res.status(401).json('No se encontró el token');
            return;
        }
        console.log(token);
        const decoded = jsonwebtoken_1.default.verify(token, env_1.SECRET_KEY);
        const result = await db_1.pool.query('SELECT * FROM usuarios WHERE id = $1', [decoded.userId]);
        if (result.rows.length === 0) {
            res.status(401).json('Token inválido');
            return;
        }
        req.user = result.rows[0];
        next();
    }
    catch (error) {
        console.error('Error al validar JWT:', error);
        res.status(500).json({ message: 'Error en el servidor' });
        return;
    }
};
