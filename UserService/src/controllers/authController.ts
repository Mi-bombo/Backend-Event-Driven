import { usersService } from "../services/user.service";
import { Request, Response } from "express";

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

      const { token, ...userWithoutToken } = userData;

      const responseData = {
        message: "Inicio de sesión exitoso",
        user: userWithoutToken,
        token,
      };

      if (platform === "web") {
        res.cookie("token", userData.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000,
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
  };

  getSession = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = req.user;
      return res.status(200).json({ msg: "Te haz autenticado", User: user });
    } catch (error) {
      return res.status(500).json({ msg: "Hubo un error inesperado." });
    }
  };

  logoutUserController = async (
    _req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      res.clearCookie("token");
      return res.status(200).json({ message: "Cierre de sesión exitoso" });
    } catch (error) {
      res.status(500).json({ message: "Error al cerrar sesión" });
    }
  };
}
