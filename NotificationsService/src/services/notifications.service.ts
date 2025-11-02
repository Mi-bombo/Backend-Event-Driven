import { transporter } from "../utils/sendEmail";
import jwt  from "jsonwebtoken";
import { SECRET_KEY, EMAIL_ENTERPRISE } from "../env/env";
import { notifRepository } from "../repositories/userRepository";
import { sendEvent } from "../kafka/producer";

export class NotificationsService extends notifRepository {
    constructor(){
        super()
    }

    sendEmail = async (email: string | Array<string | { email: string }>, subject: string, html: string) => {
        const mailOptions = {
            from: EMAIL_ENTERPRISE,
            to: Array.isArray(email) ? email.map(e => (typeof e === "string" ? e : e.email)) : email,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
    };

    sendAlert = async (token:string, subject:string ,message: string) => {
        if(!message || !subject){
            throw new Error("El mensaje es requerido");
        }

        if (!token) {
            throw new Error("Token no enviado");
        }

        let payload;
        try {
            payload = jwt.verify(token, SECRET_KEY!);
        } catch (error) {
            console.error("JWT verification error:", error);
            throw new Error("Token inválido o expirado");
        }

        console.log("Payload decodificado:", payload);

        const id = (payload as any).userId;

        const user = await this.getUserById(id);
        if(!user){
            throw new Error("Usuario no encontrado");
        }

        if(user.role_id === "17c0fc88-e08f-42fe-8d46-7e077968a319"){
            throw new Error("No tienes permisos para enviar alertas");
        }

        const emails = await this.getUsersEmail();
        if(!emails || emails.length < 1){
        return "No hay usuarios para mandarles mensajes";
        }

        console.log("Enviando notificaciones a:", emails);
        sendEvent("notifications_sent", {emails, subject, message});
    }
}