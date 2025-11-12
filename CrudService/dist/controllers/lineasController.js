"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerLineas = obtenerLineas;
exports.obtenerLineaConRutas = obtenerLineaConRutas;
exports.obtenerLineaPorId = obtenerLineaPorId;
const lineas_service_1 = require("../services/lineas.service");
const svc = new lineas_service_1.LineaService();
async function obtenerLineas(req, res) {
    const params = {
        q: req.query.q?.toString(),
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        estado: req.query.estado?.toString(),
    };
    try {
        const lineas = await svc.obtenerLineasService(params);
        res.json(lineas);
    }
    catch (e) {
        res.status(500).json({ error: e.message || String(e) });
    }
}
async function obtenerLineaConRutas(req, res) {
    const params = {
        q: req.query.q?.toString(),
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        estado: req.query.estado?.toString(),
    };
    try {
        const lineas = await svc.obtenerLineasConRutasService(params);
        res.json(lineas);
    }
    catch (e) {
        res.status(500).json({ error: e.message || String(e) });
    }
}
async function obtenerLineaPorId(req, res) {
    try {
        const linea = await svc.obtenerLineaPorId(Number(req.params.id));
        if (!linea)
            res.status(404).json({ error: "No encontrada" });
        else
            res.json(linea);
    }
    catch (e) {
        res.status(500).json({ error: e.message || String(e) });
    }
}
