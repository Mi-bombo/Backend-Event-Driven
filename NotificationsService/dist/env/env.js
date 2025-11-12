"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_SECRET_KEY = exports.PASSWORD_APP = exports.EMAIL_ENTERPRISE = exports.SECRET_KEY = exports.PORT = exports.DB_PORT = exports.DB_PASSWORD = exports.DB_DATABASE = exports.DB_HOST = exports.DB_USER = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DB_USER = process.env.DB_USER;
exports.DB_HOST = process.env.DB_HOST;
exports.DB_DATABASE = process.env.DB_DATABASE;
exports.DB_PASSWORD = process.env.DB_PASSWORD;
exports.DB_PORT = process.env.DB_PORT;
exports.PORT = parseInt(process.env.PORT || "3000");
exports.SECRET_KEY = process.env.SECRET_KEY;
exports.EMAIL_ENTERPRISE = process.env.EMAIL_ENTERPRISE;
exports.PASSWORD_APP = process.env.PASSWORD_APP;
exports.EMAIL_SECRET_KEY = process.env.EMAIL_SECRET_KEY;
