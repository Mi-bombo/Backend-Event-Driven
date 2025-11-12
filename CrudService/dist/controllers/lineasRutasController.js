"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearLineaYRuta = crearLineaYRuta;
exports.editarLineaYRuta = editarLineaYRuta;
const lineas_rutas_service_1 = require("../services/lineas.rutas.service");
const svc = new lineas_rutas_service_1.LineaRutaService();
async function crearLineaYRuta(req, res) {
    console.log(req.body);
    try {
        const result = await svc.crearLineaYRutaService(req.body);
        res.status(201).json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message || String(e) });
    }
}
async function editarLineaYRuta(req, res) {
    try {
        await svc.editarLineaYRutaService(Number(req.params.id), req.body);
        res.sendStatus(204);
    }
    catch (e) {
        res.status(500).json({ error: e.message || String(e) });
    }
}
