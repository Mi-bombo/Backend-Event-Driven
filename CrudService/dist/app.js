"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./env/env");
const producer_1 = require("./kafka/producer");
const choferRoute_1 = require("./routes/choferRoute");
const supervisorRoute_1 = require("./routes/supervisorRoute");
const lineasRutasRoute_1 = require("./routes/lineasRutasRoute");
const lineasRoute_1 = require("./routes/lineasRoute");
const choferLineaRoute_1 = require("./routes/choferLineaRoute");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use('/chofer', choferRoute_1.choferRouter);
app.use('/supervisor', supervisorRoute_1.supervisorRouter);
app.use('/lineas', lineasRoute_1.lineasRouter);
app.use('/lineas', lineasRutasRoute_1.lineaRutaRouter);
app.use('/chofer-lineas', choferLineaRoute_1.choferLineaRouter);
app.listen(env_1.PORT, () => {
    (0, producer_1.connectProducer)();
    console.log(`Server corriendo en el puerto: ${env_1.PORT}🚀`);
});
