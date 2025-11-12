"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const sendEmail_1 = require("../utils/sendEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env/env");
const userRepository_1 = require("../repositories/userRepository");
const producer_1 = require("../kafka/producer");
class NotificationsService extends userRepository_1.notifRepository {
    constructor() {
        super();
        this.sendEmail = async (email, subject, html) => {
            const mailOptions = {
                from: env_1.EMAIL_ENTERPRISE,
                to: Array.isArray(email) ? email.map(e => (typeof e === "string" ? e : e.email)) : email,
                subject: subject,
                html: html
            };
            await sendEmail_1.transporter.sendMail(mailOptions);
        };
        this.sendAlert = async (token, subject, message) => {
            if (!message || !subject) {
                throw new Error("El mensaje es requerido");
            }
            if (!token) {
                throw new Error("Token no enviado");
            }
            let payload;
            try {
                payload = jsonwebtoken_1.default.verify(token, env_1.SECRET_KEY);
            }
            catch (error) {
                console.error("JWT verification error:", error);
                throw new Error("Token inválido o expirado");
            }
            console.log("Payload decodificado:", payload);
            const id = payload.userId;
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            if (user.rol_id === 2) {
                throw new Error("No tienes permisos para enviar alertas");
            }
            const emails = await this.getUsersEmail();
            if (!emails || emails.length < 1) {
                return "No hay usuarios para mandarles mensajes";
            }
            console.log("Enviando notificaciones a:", emails);
            (0, producer_1.sendEvent)("notifications_sent", { emails, subject, message });
        };
    }
}
exports.NotificationsService = NotificationsService;
