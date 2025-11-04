import dotenv from 'dotenv';
dotenv.config();

export const DB_USER = process.env.DB_USER
export const DB_HOST = process.env.DB_HOST
export const DB_DATABASE = process.env.DB_DATABASE
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_PORT = process.env.DB_PORT
export const PORT = parseInt(process.env.PORT || "3000")
export const SECRET_KEY = process.env.SECRET_KEY
export const EMAIL_ENTERPRISE = process.env.EMAIL_ENTERPRISE
export const PASSWORD_APP = process.env.PASSWORD_APP
export const EMAIL_SECRET_KEY = process.env.EMAIL_SECRET_KEY
