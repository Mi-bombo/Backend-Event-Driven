import { NotificationsService } from "../services/notifications.service";
import { Request, Response } from "express";

export class notifController {
    private notifService: NotificationsService;

    constructor() {
        this.notifService = new NotificationsService ();
    }

    //! Chicos, en los endpoints del front en el header pongan 'Authorization: Bearer <token>' para que funcione esto
    sendNotifications = async (req:Request, res:Response): Promise<Response | void> => {
        try {
            const {subject, message} = req.body
            const authHeader = req.headers['authorization'];
            console.log("authHeader raw:", authHeader);

            const token = authHeader?.split(' ')[1];
            console.log("Authorization header:", token);

            await this.notifService.sendAlert(token!, subject, message);
            return res.status(200).json({ msg: "Mensaje enviado a todos los usuarios" });
        } catch (error) {
            console.error("Error sending notifications:", error);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
}