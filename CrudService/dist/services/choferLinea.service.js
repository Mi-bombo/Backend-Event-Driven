"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoferLineaService = void 0;
const choferLineaRepository_1 = require("../repositories/choferLineaRepository");
const httpError_1 = require("../utils/httpError");
class ChoferLineaService {
    constructor() {
        this.repo = new choferLineaRepository_1.ChoferLineaRepository();
    }
    list(filters = {}) {
        return this.repo.listAssignments(filters);
    }
    async getById(id) {
        const assignment = await this.repo.getById(id);
        if (!assignment) {
            throw new httpError_1.HttpError(404, "Asignación no encontrada");
        }
        return assignment;
    }
    async create(payload) {
        const choferId = this.parseId(payload.chofer_id, "chofer_id");
        const lineaId = this.parseId(payload.linea_id, "linea_id");
        const estado = this.normalizeEstado(payload.estado);
        const fechaAsignacion = this.normalizeFecha(payload.fecha_asignacion);
        const chofer = await this.repo.getChoferSummary(choferId);
        if (!chofer) {
            throw new httpError_1.HttpError(404, "Chofer no encontrado o sin permisos");
        }
        const linea = await this.repo.getLineaSummary(lineaId);
        if (!linea) {
            throw new httpError_1.HttpError(404, "La línea indicada no existe");
        }
        const duplicated = await this.repo.findByChoferAndLinea(choferId, lineaId);
        if (duplicated) {
            throw new httpError_1.HttpError(409, "El chofer ya tiene esta línea asignada");
        }
        const assignment = await this.repo.createAssignment({
            choferId,
            lineaId,
            estado,
            fechaAsignacion,
        });
        if (!assignment) {
            throw new httpError_1.HttpError(500, "No se pudo crear la asignación");
        }
        return assignment;
    }
    async update(id, payload) {
        const assignmentId = this.parseId(id, "id");
        const current = await this.repo.getById(assignmentId);
        if (!current) {
            throw new httpError_1.HttpError(404, "Asignación no encontrada");
        }
        if (typeof payload.linea_id === "undefined" &&
            typeof payload.estado === "undefined") {
            throw new httpError_1.HttpError(400, "Debes enviar al menos un campo para actualizar (linea_id o estado)");
        }
        let lineaId;
        if (typeof payload.linea_id !== "undefined") {
            lineaId = this.parseId(payload.linea_id, "linea_id");
            if (lineaId !== current.linea_id) {
                const linea = await this.repo.getLineaSummary(lineaId);
                if (!linea) {
                    throw new httpError_1.HttpError(404, "La línea indicada no existe");
                }
                const duplicated = await this.repo.findByChoferAndLinea(current.chofer_id, lineaId);
                if (duplicated && duplicated.id !== assignmentId) {
                    throw new httpError_1.HttpError(409, "El chofer ya tiene esta línea asignada");
                }
            }
        }
        const estado = this.normalizeEstado(payload.estado ?? current.estado);
        const updated = await this.repo.updateAssignment({
            id: assignmentId,
            lineaId,
            estado,
        });
        if (!updated) {
            throw new httpError_1.HttpError(500, "No se pudo actualizar la asignación");
        }
        return updated;
    }
    async delete(id) {
        const assignmentId = this.parseId(id, "id");
        const deleted = await this.repo.deleteAssignment(assignmentId);
        if (!deleted) {
            throw new httpError_1.HttpError(404, "La asignación no existe o ya fue eliminada");
        }
        return deleted;
    }
    parseId(value, field) {
        const parsed = typeof value === "string" ? Number(value) : Number(value);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new httpError_1.HttpError(400, `El campo ${field} debe ser un entero válido`);
        }
        return parsed;
    }
    normalizeEstado(estado) {
        const parsed = estado?.trim();
        if (!parsed) {
            return "activo";
        }
        if (parsed.length > 50) {
            throw new httpError_1.HttpError(400, "El estado no puede superar 50 caracteres");
        }
        return parsed;
    }
    normalizeFecha(fecha) {
        if (!fecha)
            return undefined;
        const parsed = new Date(fecha);
        if (Number.isNaN(parsed.getTime())) {
            throw new httpError_1.HttpError(400, "fecha_asignacion debe ser una fecha válida en formato ISO");
        }
        return parsed.toISOString();
    }
}
exports.ChoferLineaService = ChoferLineaService;
