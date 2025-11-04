import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env/env";

export interface UserTokenPayload {
  userId: number;
  rol_id: number;
  email?: string;
  nombre?: string;
}


export function getUserIdFromToken(token: string): number {
  if (!token) throw new Error("Token no enviado");

  try {
    const payload = jwt.verify(token, SECRET_KEY!);
    const id = (payload as any).userId;
    if (!id) throw new Error("Token inválido: falta userId");
    return id;
  } catch (error) {
    console.error("Error verificando token:", error);
    throw new Error("Token inválido o expirado");
  }
}

export function getRoleIdFromToken(token: string): number {
  if (!token) throw new Error("Token no enviado");
  try {
    const payload = jwt.verify(token, SECRET_KEY!);
    console.log(payload);
    const rol_id = (payload as any).rol_id;
    console.log("hola", rol_id);
    if (!rol_id) throw new Error("Token inválido: falta rol_id");
    return rol_id;
  } catch (error) {
    console.error("Error verificando token:", error);
    throw new Error("Token inválido o expirado");
  }
}

