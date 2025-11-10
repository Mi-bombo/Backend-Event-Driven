import { Router } from "express";
import { userControllers } from "../controllers/authController";
import { jwtValidator } from "../middlewares/jwtValidator";
export const authUserRoute = Router()
const authController = new userControllers()

authUserRoute.post("/login", authController.loginUserController)
authUserRoute.post("/register", authController.registerUserController)
authUserRoute.get("/session", jwtValidator.validarJwt, authController.getSession)
authUserRoute.delete("/logout", authController.logoutUserController)
authUserRoute.get("/stream", jwtValidator.validarJwt, authController.sseConnect);
