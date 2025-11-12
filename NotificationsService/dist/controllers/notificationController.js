"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifController = void 0;
const notifications_service_1 = require("../services/notifications.service");
class notifController {
    constructor() {
        this.sendNotifications = async (req, res) => {
            try {
                const { subject, message } = req.body;
                const authHeader = req.headers['authorization'];
                console.log("authHeader raw:", authHeader);
                const token = authHeader?.split(' ')[1];
                console.log("Authorization header:", token);
                await this.notifService.sendAlert(token, subject, message);
                return res.status(200).json({ msg: "Mensaje enviado a todos los usuarios" });
            }
            catch (error) {
                console.error("Error sending notifications:", error);
                return res.status(500).json({ success: false, error: "Internal Server Error" });
            }
        };
        this.notifService = new notifications_service_1.NotificationsService();
    }
}
exports.notifController = notifController;
