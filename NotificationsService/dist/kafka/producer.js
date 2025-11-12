"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectProducer = connectProducer;
exports.sendEvent = sendEvent;
const kafkaConfig_1 = __importDefault(require("./kafkaConfig"));
const producer = kafkaConfig_1.default.producer();
async function connectProducer() {
    await producer.connect();
    console.log("Kafka Producer conectado");
}
async function sendEvent(topic, message) {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log(`Evento enviado → ${topic}`, message);
    }
    catch (error) {
        console.error("Error enviando evento Kafka:", error);
    }
}
