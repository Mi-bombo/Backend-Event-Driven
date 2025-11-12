"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./env/env");
const consumer_1 = require("./kafka/consumer");
const producer_1 = require("./kafka/producer");
const notifRouter_1 = require("./routes/notifRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use("/info", notifRouter_1.notifRouter);
app.listen(env_1.PORT, () => {
    (0, consumer_1.startConsumers)();
    (0, producer_1.connectProducer)();
    console.log(`Server corriendo en el puerto: ${env_1.PORT}🚀`);
});
