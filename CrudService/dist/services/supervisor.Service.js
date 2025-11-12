"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supervisorService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const turnoRepository_1 = require("../repositories/turnoRepository");
const supervisorRepository_1 = require("../repositories/supervisorRepository");
const isISODate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
class supervisorService {
    constructor() {
        this.turnosRepo = new turnoRepository_1.turnoRepository();
        this.supervisorRepo = new supervisorRepository_1.supervisorRepository();
    }
    async listTurnosAsignados() {
        return this.turnosRepo.getAllTurnosAsignados();
    }
    async createTurnoPorDia(id_user, id_turno, fecha) {
        if (!id_user || !id_turno || !isISODate(fecha)) {
            throw new Error("Faltan datos para asignar el turno (id_user, id_turno, fecha YYYY-MM-DD).");
        }
        const turno = await this.turnosRepo.getTurnoById(id_turno);
        if (!turno)
            throw new Error("El turno no existe.");
        return this.turnosRepo.createTurnoPorDia(id_user, id_turno, fecha);
    }
    async updateTurnoChofer(id, id_turno, fecha) {
        if (!id || !id_turno || !isISODate(fecha)) {
            throw new Error("Faltan datos para actualizar (id, id_turno, fecha YYYY-MM-DD).");
        }
        const updated = await this.turnosRepo.updateTurnoChofer(id, id_turno, fecha);
        if (!updated)
            throw new Error("No se encontró el turno para actualizar.");
        return updated;
    }
    async deleteTurnoPorDia(id) {
        if (!id)
            throw new Error("Falta id para eliminar.");
        const deleted = await this.turnosRepo.deleteTurnoPorDia(id);
        if (!deleted)
            throw new Error("No se encontró el turno para eliminar.");
        return deleted;
    }
    async listCatalogoTurnos() {
        return this.turnosRepo.listCatalogoTurnos();
    }
    async getTurnoInfo(id_turno) {
        return this.turnosRepo.getTurnoById(id_turno);
    }
    async getAllChoferes() {
        return this.supervisorRepo.getAllChoferes();
    }
    async createChofer(nombre, email, password) {
        if (!nombre || !email || !password)
            throw new Error("Faltan datos del chofer.");
        const hash = await bcryptjs_1.default.hash(password, 10);
        return this.supervisorRepo.createChofer(nombre, email, hash, 2);
    }
    async getChoferById(id) {
        const ch = await this.supervisorRepo.getChoferById(id);
        if (!ch)
            throw new Error("Chofer no encontrado");
        return ch;
    }
    async updateChofer(id, nombre, email, password) {
        if (!id)
            throw new Error("Falta id del chofer.");
        const hash = password ? await bcryptjs_1.default.hash(password, 10) : null;
        const updated = await this.supervisorRepo.updateChofer(nombre ?? null, email ?? null, hash, 2, id);
        if (!updated)
            throw new Error("No se pudo actualizar el chofer.");
        return updated;
    }
    async deleteChofer(id) {
        if (!id)
            throw new Error("Falta id del chofer.");
        const del = await this.supervisorRepo.deleteChofer(id);
        if (!del)
            throw new Error("No se pudo eliminar el chofer.");
        return del;
    }
}
exports.supervisorService = supervisorService;
