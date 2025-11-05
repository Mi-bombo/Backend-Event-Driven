import { supervisorRepository } from "../repositories/supervisorRepository";
import { turnoRepository } from "../repositories/turnoRepository";
import { getRoleIdFromToken, getUserIdFromToken } from "../utils/getUserIdFromToken";
import { authRepository } from "../repositories/authRepository";

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env/env";
import { sendEvent } from "../kafka/producer";

export class supervisorService {
    supervisorRepository: supervisorRepository;
    turnoRepository: turnoRepository;
    authRepository: authRepository;
    constructor() {
        this.supervisorRepository = new supervisorRepository();
        this.turnoRepository = new turnoRepository();
        this.authRepository = new authRepository();
    }
  //! --- CHOFERES ---

async getAllChoferes() {
  const choferes = await this.supervisorRepository.getAllChoferes();
  if (!choferes.length) throw new Error("No hay choferes registrados.");
  return choferes;
}
  async getChoferById(id_user: number) {
    if (!id_user) throw new Error("El ID del chofer es obligatorio.");
    const chofer = await this.supervisorRepository.getChoferById(id_user);
    if (!chofer) throw new Error("Chofer no encontrado.");
    return chofer;
  }

  async createChofer(nombre: string, email: string, password: string, rol_id: number) {
    if (!nombre || !email || !password || !rol_id)
      throw new Error("Faltan datos para crear el chofer.");
    return await this.supervisorRepository.createChofer(nombre, email, password, rol_id);
  }

  async updateChofer(
    id_user: number,
    nombre?: string,
    email?: string,
    password?: string,
    rol_id?: number
  ) {
    if (!id_user) throw new Error("El ID del chofer es obligatorio.");
    return await this.supervisorRepository.updateChofer(
      nombre!,
      email!,
      password!,
      rol_id!,
      id_user
    );
  }

  async deleteChofer(id_user: number) {
    if (!id_user) throw new Error("El ID del chofer es obligatorio.");
    return await this.supervisorRepository.deleteChofer(id_user);
  }

  //! --- TURNOS ---
  async getAllTurnosAsignados(token: string) {
    const id = getUserIdFromToken(token);
    const user = await this.authRepository.getUserForId(id);
    console.log(user);
    if(user!.rol_id !== 1){
      throw new Error("No tienes permisos para ver los turnos asignados.");
    }

    return await this.turnoRepository.getAllTurnosAsignados();
  }

    async createTurnoPorDia(id_user: number, id_turno: number, dia: string, token: string) {
    if (!token) throw new Error("El usuario no está autenticado");
    if (!id_user || !id_turno || !dia) throw new Error("Faltan datos para asignar el turno.");

    const id = getUserIdFromToken(token);
    const user = await this.authRepository.getUserForId(id);
    if (!user || user.rol_id !== 1) throw new Error("No tienes permisos para crear un turno.");

    const nuevoTurno = await this.turnoRepository.createTurnoPorDia(id_user, id_turno, dia);

    const chofer = await this.authRepository.getUserForId(id_user);
    if (!chofer) throw new Error("El chofer destinatario no existe.");

    const payload = {
        email: chofer.email,
        id_user: chofer.id,
        dia: nuevoTurno.dia,
        id_turno: nuevoTurno.id_turno,
    };

    // Enviar SSE al chofer
    sendEvent("turno-creado", payload);

    return nuevoTurno;
}


  async updateTurnoChofer(id: number, id_turno: number, dia: string, token: string) {
  if (!token) throw new Error("El usuario no está autenticado");
  if (!dia || !id_turno) throw new Error("Faltan datos para actualizar el turno del chofer.");

  const idUsuario = getUserIdFromToken(token);
  const user = await this.authRepository.getUserForId(idUsuario);

  if (user!.rol_id !== 1) throw new Error("No tienes permisos para editar los turnos.");

  const turnoActualizado = await this.turnoRepository.updateTurnoChofer(id, id_turno, dia);
  if (!turnoActualizado) throw new Error("No se encontró el turno para actualizar.");

  sendEvent("turno-actualizado", { email: user?.email, id_user: user?.id, dia, id_turno });
  return turnoActualizado;
}


  async deleteTurnoPorDia(id: number, token:string) {
    if(!token){
      throw new Error("El usuario no está autenticado");
    }
    if (!id) throw new Error("El ID del turno asignado es obligatorio.");

    const idUser = getUserIdFromToken(token);
    const user = await this.authRepository.getUserForId(idUser);
    if(user!.rol_id !== 1){
      throw new Error("No tienes permisos para borrar un turno.");
    }
    const turnoEliminado = await this.turnoRepository.deleteTurnoPorDia(id);
    if (!turnoEliminado) throw new Error("No se encontró el turno para eliminar.");
    return turnoEliminado;
  }
}

