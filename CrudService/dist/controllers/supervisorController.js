"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supervisorController = void 0;
const supervisor_Service_1 = require("../services/supervisor.Service");
const producer_1 = require("../kafka/producer");
const svc = new supervisor_Service_1.supervisorService();
class supervisorController {
    constructor() {
        this.getAllTurnosAsignados = async (_req, res) => {
            try {
                const data = await svc.listTurnosAsignados();
                res.json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        };
        this.createTurnoPorDia = async (req, res) => {
            try {
                const id_user = Number(req.params.id);
                const { id_turno, fecha } = req.body || {};
                const created = await svc.createTurnoPorDia(id_user, Number(id_turno), String(fecha));
                const turnoInfo = await svc.getTurnoInfo(Number(id_turno));
                await (0, producer_1.sendEvent)("turno-creado", {
                    id: created.id,
                    id_user: created.id_user,
                    id_turno: created.id_turno,
                    nombre_turno: turnoInfo?.turno || "Turno",
                    dia: created.fecha,
                    fecha: created.fecha
                });
                res.status(201).json(created);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        };
        this.updateTurnoChofer = async (req, res) => {
            try {
                const id = Number(req.params.id);
                const { id_turno, fecha } = req.body || {};
                const updated = await svc.updateTurnoChofer(id, Number(id_turno), String(fecha));
                const turnoInfo = await svc.getTurnoInfo(Number(id_turno));
                await (0, producer_1.sendEvent)("turno-actualizado", {
                    id: updated.id,
                    id_user: updated.id_user,
                    id_turno: updated.id_turno,
                    nombre_turno: turnoInfo?.turno || "Turno",
                    dia: updated.fecha,
                    fecha: updated.fecha
                });
                res.json(updated);
            }
            catch (e) {
                res.status(400).json({ error: e.message });
            }
        };
        this.deleteTurnoPorDia = async (req, res) => {
            try {
                const id = Number(req.params.id);
                await svc.deleteTurnoPorDia(id);
                res.json({ ok: true });
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        };
        this.getCatalogoTurnos = async (_req, res) => {
            try {
                const data = await svc.listCatalogoTurnos();
                res.json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        };
        this.getAllChoferes = async (_req, res) => {
            try {
                const data = await svc.getAllChoferes();
                res.json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        };
        this.createChofer = async (req, res) => {
            try {
                const { nombre, email, password } = req.body || {};
                const chofer = await svc.createChofer(nombre, email, password);
                res.status(201).json(chofer);
            }
            catch (e) {
                res.status(400).json({ error: e.message });
            }
        };
        this.getChoferById = async (req, res) => {
            try {
                const id = Number(req.params.id);
                const ch = await svc.getChoferById(id);
                res.json(ch);
            }
            catch (e) {
                res.status(404).json({ error: e.message });
            }
        };
        this.updateChofer = async (req, res) => {
            try {
                const id = Number(req.params.id);
                const { nombre, email, password } = req.body || {};
                const ch = await svc.updateChofer(id, nombre, email, password);
                res.json(ch);
            }
            catch (e) {
                res.status(400).json({ error: e.message });
            }
        };
        this.deleteChofer = async (req, res) => {
            try {
                const id = Number(req.params.id);
                await svc.deleteChofer(id);
                res.json({ ok: true });
            }
            catch (e) {
                res.status(400).json({ error: e.message });
            }
        };
    }
}
exports.supervisorController = supervisorController;
