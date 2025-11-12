"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "notif-service",
    brokers: ["localhost:9094"],
});
exports.default = kafka;
