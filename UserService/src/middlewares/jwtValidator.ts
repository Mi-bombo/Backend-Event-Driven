import { IUser, Token } from "../interfaces/IUser";
import { SECRET_KEY } from "../env/env";
import jwt from "jsonwebtoken";
import { pool } from "../db/db";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayloadCustom {
  userId: string;
}

export class jwtValidator {

   static createJwt = (userId:IUser["id"]): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const payLoad = { userId };
            jwt.sign(payLoad, SECRET_KEY!, {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) {
                    reject('No se pudo generar el token');
                } else {
                    resolve(token!);
                }
            });
        } catch (error) {
            console.log(error);
        }
    });
};

    static validarJwt = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
        let token = null;
        const authHeader = req.headers['authorization'];
        console.log(authHeader)
        if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        console.log("aca",token)
        } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        }

        if (!token) {
        res.status(401).json('No se encontró el token');
        return;
        }
        console.log(token)

        const decoded = jwt.verify(token, SECRET_KEY!) as JwtPayloadCustom;
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [decoded.userId]);
        if (result.rows.length === 0) {
        res.status(401).json('Token inválido');
        return;
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        console.error('Error al validar JWT:', error);
        res.status(500).json({ message: 'Error en el servidor' });
        return;
    }
    };

}
