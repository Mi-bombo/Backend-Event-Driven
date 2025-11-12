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
                console.error('[supervisorController.assignLineas] error:', e?.message ?? e, e?.stack ?? 'no-stack');
                // Devolver mensaje y además loguear stack para depuración local
                return res.status(400).json({ error: e?.message ?? String(e) });
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
                const idRaw = req.params.id;
                console.log(`[supervisorController.deleteChofer] request params id=`, idRaw);
                const id = Number(idRaw);
                if (!id || Number.isNaN(id)) {
                    console.warn(`[supervisorController.deleteChofer] id inválido:`, idRaw);
                    return res.status(400).json({ error: "id inválido" });
                }
                const result = await svc.deleteChofer(id);
                console.log(`[supervisorController.deleteChofer] eliminado:`, result);
                res.json({ ok: true });
            }
            catch (e) {
                console.error("[supervisorController.deleteChofer] error:", e?.message ?? e, e?.stack ?? "");
                const msg = e?.message ?? String(e);
                if (msg.includes("Chofer no encontrado") || msg.includes("No se pudo eliminar el chofer")) {
                    return res.status(404).json({ error: msg });
                }
                if (msg.includes("impiden su eliminación") || msg.includes("dependencias")) {
                    // conflicto por claves foráneas / recursos relacionados
                    return res.status(409).json({ error: msg });
                }
                res.status(400).json({ error: msg });
            }
        };
        // Asignar líneas a chofer y emitir evento Kafka
        this.assignLineas = async (req, res) => {
            try {
                const id_user = Number(req.params.id);
                // Aceptar distintas formas de envío: { lineas: [...] } o directamente [...]
                const raw = req.body;
                // log para depuración temporal
                console.debug(`[assignLineas] id_user=${id_user} content-type=${req.headers['content-type']} body=`, raw);
                let lineas;
                if (Array.isArray(raw))
                    lineas = raw;
                else if (raw && Array.isArray(raw.lineas))
                    lineas = raw.lineas;
                else {
                    return res.status(400).json({ error: "Se espera campo 'lineas' como arreglo de ids o un arreglo en el body" });
                }
                // Normalizar a arreglo de ids (números)
                const ids = (lineas || []).map((l) => {
                    if (typeof l === 'number')
                        return Number(l);
                    if (l && typeof l === 'object')
                        return Number(l.id ?? l.linea_id ?? l.lineaId ?? l.linea ?? null);
                    return Number(l);
                }).filter((v) => !Number.isNaN(v));
                await svc.assignLineas(id_user, ids);
                // Emitir evento en caliente para notificaciones en la arquitectura event-driven
                try {
                    const chofer = await svc.getChoferById(id_user).catch(() => null);
                    const assigned = await svc.getLineasByChofer(id_user).catch(() => []);
                    await (0, producer_1.sendEvent)("lineas-asignadas", {
                        chofer: chofer ? { id: chofer.id, nombre: chofer.nombre, email: chofer.email } : { id: id_user },
                        lineas: assigned,
                        timestamp: new Date().toISOString(),
                    });
                }
                catch (evErr) {
                    console.error("Error al enviar evento de lineas-asignadas:", evErr);
                }
                res.json({ ok: true });
            }
            catch (e) {
                res.status(400).json({ error: e.message });
            }
        };
        this.getLineasByChofer = async (req, res) => {
            try {
                const id = Number(req.params.id);
                const data = await svc.getLineasByChofer(id);
                res.json(data);
            }
            catch (e) {
                res.status(400).json({ error: e.message });
            }
        };
        // Dev-only: devolver la fila cruda de usuarios por id para diagnóstico
        this.debugGetUsuarioById = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (!id || Number.isNaN(id))
                    return res.status(400).json({ error: "id inválido" });
                // Usamos el método existente getChoferById como diagnóstico (dev-only)
                const ch = await svc.getChoferById(id);
                if (!ch)
                    return res.status(404).json({ error: "No encontrado" });
                res.json(ch);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        };
        // Dev-only: devolver contadores de dependencias (turnos, asignaciones de línea)
        this.debugGetUsuarioDeps = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (!id || Number.isNaN(id))
                    return res.status(400).json({ error: "id inválido" });
                const counts = await svc.getDependencyCounts(id).catch(() => ({ turnosCount: -1, lineasCount: -1 }));
                res.json({ id, ...counts });
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        };
    }
}
exports.supervisorController = supervisorController;
