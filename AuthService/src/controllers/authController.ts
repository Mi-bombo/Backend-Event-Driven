import { usersService } from "../services/user.service";
import { Request, Response } from "express";
import { initSSE } from "../services/sse.Service";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env/env";
import { pool } from "../db/db";

export class userControllers {
    private services: usersService;
    constructor() {
        this.services = new usersService();
    }

    loginUserController = async (req: Request, res: Response): Promise<Response | void> => {
        const platform: string = req.get('x-platform') ?? 'web';
        try {

            const { email, password } = req.body;
            const userData = await this.services.loginUserService(email, password);
            if (!userData) {
                res.status(400).json({ message: 'Error al iniciar sesión' });
                return
            }

            const { token, ...userWithoutToken } = userData

            const responseData = {
                message: 'Inicio de sesión exitoso',
                user: userWithoutToken,
                token
            };

            if (platform === 'web') {
                res.cookie("token", userData.token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600000,
                    sameSite: 'none'
                });
            }

            return res.status(201).json(responseData);
        } catch (error: any) {
            console.error('Error en el inicio de sesión:', error.message);
            res.status(error.status || 500).json({ error: error.message || 'Error del servidor' });
        }
    }

    registerUserController = async (req: Request, res: Response): Promise<Response | void> => {
        const { nombre, email, password, role = 'chofer' } = req.body;
        try {
            console.log(nombre, email, password)
            await this.services.registerUserService(nombre, email, password, role);
            console.log("aca")
            return res.status(201).json({ message: 'Usuario registrado con éxito.' });
        } catch (error: any) {
            console.error('Error al registrar el usuario:', error.message);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    getSession = async (req: Request, res: Response): Promise<Response> => {
        try {
            const token = req.cookies.token;
            const user = req.user
            return res.status(200).json({ msg: "Te haz autenticado", User: user, token: token });
        } catch (error) {
            return res.status(500).json({ msg: "Hubo un error inesperado." });
        }
    }

    logoutUserController = async (_req: Request, res: Response): Promise<Response | void> => {
        try {
            res.clearCookie("token")
            return res.status(200).json({ message: "Cierre de sesión exitoso" });
        } catch (error) {
            res.status(500).json({ message: "Error al cerrar sesión" });
        }
    }

    
    sseConnect = async (req: Request, res: Response): Promise<void> => {
        try {
          const token = req.query?.token as string;
          if (!token) {
            res.status(401).end();
            return;
          }
      
          let payload: any;
          try {
            payload = jwt.verify(token, SECRET_KEY!);
          } catch (err) {
            console.error("Token inválido:", err);
            res.status(401).end();
            return;
          }
      
          const userId = payload.userId || payload.id || payload.userID;
          if (!userId) {
            res.status(401).end();
            return;
          }
      
          (req as any).user = { id: userId };
      
          initSSE(req, res);
          
        } catch (error) {
          console.error('Error SSE:', error);
          res.status(403).end();
        }
      };
      
    
    

}