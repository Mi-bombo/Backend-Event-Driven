import { supervisorRepository } from "../repositories/supervisorRepository";
import { turnoRepository } from "../repositories/turnoRepository";

class supervisorService {
    supervisorRepository: supervisorRepository;
    turnoRepository: turnoRepository;
    constructor() {
        this.supervisorRepository = new supervisorRepository();
        this.turnoRepository = new turnoRepository();
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
  async getAllTurnosAsignados() {
    return await this.turnoRepository.getAllTurnosAsignados();
  }

  async createTurnoPorDia(id_user: number, id_turno: number, dia: string) {
    if (!id_user || !id_turno || !dia)
      throw new Error("Faltan datos para asignar el turno.");
    return await this.turnoRepository.createTurnoPorDia(id_user, id_turno, dia);
  }

  async updateTurnoChofer(id_user: number, dia: string, id_turno: number) {
    if (!id_user || !dia || !id_turno)
      throw new Error("Faltan datos para actualizar el turno del chofer.");
    const turnoActualizado = await this.turnoRepository.updateTurnoChofer(id_user, dia, id_turno);
    if (!turnoActualizado) throw new Error("No se encontró el turno para actualizar.");
    return turnoActualizado;
  }

  async deleteTurnoPorDia(id: number) {
    if (!id) throw new Error("El ID del turno asignado es obligatorio.");
    const turnoEliminado = await this.turnoRepository.deleteTurnoPorDia(id);
    if (!turnoEliminado) throw new Error("No se encontró el turno para eliminar.");
    return turnoEliminado;
  }
}

export default new supervisorService();
