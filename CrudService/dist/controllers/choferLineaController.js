"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoferLineaController = void 0;
const choferLinea_service_1 = require("../services/choferLinea.service");
const httpError_1 = require("../utils/httpError");
const producer_1 = require("../kafka/producer");
const service = new choferLinea_service_1.ChoferLineaService();
const handleError = (error, res) => {
    if ((0, httpError_1.isHttpError)(error)) {
        return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error en ChoferLineaController:", error);
    return res
        .status(500)
        .json({ error: "Ocurrió un error inesperado en el servidor." });
};
class ChoferLineaController {
    constructor() {
        this.list = async (req, res) => {
            try {
                const filters = {
                    choferId: req.query.choferId ? Number(req.query.choferId) : undefined,
                    lineaId: req.query.lineaId ? Number(req.query.lineaId) : undefined,
                    estado: req.query.estado?.toString(),
                };
                const assignments = await service.list(filters);
                res.json(assignments);
            }
            catch (error) {
                handleError(error, res);
            }
        };
        this.getById = async (req, res) => {
            try {
                const assignment = await service.getById(Number(req.params.id));
                res.json(assignment);
            }
            catch (error) {
                handleError(error, res);
            }
        };
        this.create = async (req, res) => {
            try {
                const assignment = await service.create({
                    chofer_id: req.body?.chofer_id,
                    linea_id: req.body?.linea_id,
                    estado: req.body?.estado,
                    fecha_asignacion: req.body?.fecha_asignacion,
                });
                await (0, producer_1.sendEvent)("chofer-linea-asignada", assignment);
                res.status(201).json(assignment);
            }
            catch (error) {
                handleError(error, res);
            }
        };
        this.update = async (req, res) => {
            try {
                const assignment = await service.update(Number(req.params.id), {
                    linea_id: req.body?.linea_id,
                    estado: req.body?.estado,
                });
                await (0, producer_1.sendEvent)("chofer-linea-actualizada", assignment);
                res.json(assignment);
            }
            catch (error) {
                handleError(error, res);
            }
        };
        this.delete = async (req, res) => {
            try {
                const deleted = await service.delete(Number(req.params.id));
                await (0, producer_1.sendEvent)("chofer-linea-eliminada", deleted);
                res.json({ ok: true, data: deleted });
            }
            catch (error) {
                handleError(error, res);
            }
        };
    }
}
exports.ChoferLineaController = ChoferLineaController;
