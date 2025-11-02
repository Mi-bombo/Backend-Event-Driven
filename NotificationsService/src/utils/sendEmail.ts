import nodemailer from 'nodemailer'
import { EMAIL_ENTERPRISE, PASSWORD_APP } from '../env/env';


export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ENTERPRISE,
    pass: PASSWORD_APP,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
