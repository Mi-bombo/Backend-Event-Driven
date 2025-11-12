"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConsumers = startConsumers;
const kafkaConfig_1 = __importDefault(require("./kafkaConfig"));
const notifications_service_1 = require("../services/notifications.service");
const notificationsService = new notifications_service_1.NotificationsService();
async function createConsumer(topic, groupId) {
    const consumer = kafkaConfig_1.default.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value?.toString();
            try {
                const data = JSON.parse(value || "{}");
                if (topic === "user_registered") {
                    notificationsService.sendEmail(data.email, "Bienvenido a Nuestra Plataforma", `<h1>Hola ${data.nombre}, bienvenido a nuestra plataforma!</h1><p>Gracias por registrarte.</p>`);
                }
                else if (topic === "notifications_sent") {
                    console.log("Notificaciones enviadas");
                    for (const e of data.emails) {
                        const email = e.email;
                        await notificationsService.sendEmail(email, data.subject, `<h1>${data.message}</h1>`);
                    }
                }
                else if (topic === "chofer-linea-asignada") {
                    if (!data.chofer_email) {
                        console.warn("Evento chofer-linea-asignada sin email de chofer");
                        return;
                    }
                    await notificationsService.sendEmail(data.chofer_email, "Nueva línea asignada", `<h1>Hola ${data.chofer_nombre || "Chofer"}</h1>
                         <p>Se te asignó la línea <strong>${data.linea_nombre}</strong>.</p>
                         <p>Estado actual: ${data.estado ?? "sin estado"}. Fecha: ${data.fecha_asignacion ?? "sin registrar"}.</p>`);
                }
            }
            catch (err) {
                console.error("Error parseando el mensaje:", err);
            }
        },
    });
}
async function startConsumers() {
    await createConsumer("user_registered", "notification-user-registered-group");
    await createConsumer("notifications_sent", "notification-sent-group");
    await createConsumer("chofer-linea-asignada", "notification-lineas-group");
}
