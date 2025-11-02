import { Router } from "express";
import { notifController } from "../controllers/notificationController";

export const notifRouter = Router()
const notification = new notifController()

notifRouter.post('/notify', notification.sendNotifications)