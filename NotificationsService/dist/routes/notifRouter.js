"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifRouter = void 0;
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
exports.notifRouter = (0, express_1.Router)();
const notification = new notificationController_1.notifController();
exports.notifRouter.post('/notify', notification.sendNotifications);
