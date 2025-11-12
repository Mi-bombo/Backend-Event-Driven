import bcrypt from "bcryptjs";
import { turnoRepository } from "../repositories/turnoRepository";
import { supervisorRepository } from "../repositories/supervisorRepository";

const isISODate = (s: unknown): s is string =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

export class supervisorService {
  private turnosRepo = new turnoRepository();
  private supervisorRepo = new supervisorRepository();

  async listTurnosAsignados() {
    return this.turnosRepo.getAllTurnosAsignados();
  }

  async createTurnoPorDia(id_user: number, id_turno: number, fecha: string) {
    if (!id_user || !id_turno || !isISODate(fecha)) {
      throw new Error("Faltan datos para asignar el turno (id_user, id_turno, fecha YYYY-MM-DD).");
    }
    const turno = await this.turnosRepo.getTurnoById(id_turno);
    if (!turno) throw new Error("El turno no existe.");

    return this.turnosRepo.createTurnoPorDia(id_user, id_turno, fecha);
  }

  async updateTurnoChofer(id: number, id_turno: number, fecha: string) {
    if (!id || !id_turno || !isISODate(fecha)) {
      throw new Error("Faltan datos para actualizar (id, id_turno, fecha YYYY-MM-DD).");
    }
    const updated = await this.turnosRepo.updateTurnoChofer(id, id_turno, fecha);
    if (!updated) throw new Error("No se encontró el turno para actualizar.");
    return updated;
  }

  async deleteTurnoPorDia(id: number) {
    if (!id) throw new Error("Falta id para eliminar.");
    const deleted = await this.turnosRepo.deleteTurnoPorDia(id);
    if (!deleted) throw new Error("No se encontró el turno para eliminar.");
    return deleted;
  }

  async listCatalogoTurnos() {
    return this.turnosRepo.listCatalogoTurnos();
  }

  async getTurnoInfo(id_turno: number) {
    return this.turnosRepo.getTurnoById(id_turno);
  }

  async getAllChoferes() {
    return this.supervisorRepo.getAllChoferes();
  }

  async createChofer(nombre: string, email: string, password: string) {
    if (!nombre || !email || !password) throw new Error("Faltan datos del chofer.");
    const hash = await bcrypt.hash(password, 10);
    return this.supervisorRepo.createChofer(nombre, email, hash, 2);
  }

  async getChoferById(id: number) {
    const ch = await this.supervisorRepo.getChoferById(id);
    if (!ch) throw new Error("Chofer no encontrado");
    return ch;
  }

  async assignLineas(id_user:number, lineas:number[]) {
    if (!id_user) throw new Error("Falta id del chofer.");
    if (!Array.isArray(lineas)) throw new Error("Lineas inválidas.");
    return this.supervisorRepo.assignLineasToChofer(id_user, lineas);
  }

  async getLineasByChofer(id_user:number) {
    if (!id_user) throw new Error("Falta id del chofer.");
    return this.supervisorRepo.getLineasByChofer(id_user);
  }

  async updateChofer(id: number, nombre?: string, email?: string, password?: string) {
    if (!id) throw new Error("Falta id del chofer.");
    const hash = password ? await bcrypt.hash(password, 10) : null;
    const updated = await this.supervisorRepo.updateChofer(
      nombre ?? null,
      email ?? null,
      hash,
      2,
      id
    );
    if (!updated) throw new Error("No se pudo actualizar el chofer.");
    return updated;
  }

  async deleteChofer(id: number) {
    if (!id) throw new Error("Falta id del chofer.");
    const del = await this.supervisorRepo.deleteChofer(id);
    if (!del) throw new Error("No se pudo eliminar el chofer.");
    return del;
  }
}
