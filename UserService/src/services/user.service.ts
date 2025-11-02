import { IUser } from "../interfaces/IUser";
import { compare, hash, genSalt } from "bcrypt";
import { jwtValidator } from "../middlewares/jwtValidator";
import { pool } from "../db/db";
import { v4 as uuidv4 } from 'uuid';
import { sendEvent } from "../kafka/producer";
import { authRepository } from "../repositories/authRepository";





export class usersService extends authRepository {
    constructor(){
        super();
    }

    async loginUserService(email: string, password: string): Promise<Omit<IUser, 'password_hash'> & { token?: string }> {
        if (!email || !password) {
            throw new Error("Todos los datos son requeridos")
        }

        const existingEmail = await this.getUserForEmail(email)
        if (!existingEmail) {
            throw new Error("Usuario no encontrado")
        }

        const isValidPassword = await compare(password, existingEmail.password_hash)
        if (!isValidPassword) {
            throw new Error("Contraseña incorrecta")
        }

        const token = await jwtValidator.createJwt(existingEmail.id)
        const { password_hash, ...userWithoutPassword } = existingEmail

        return {
            ...userWithoutPassword,
            token
        }
    }


    async registerUserService(nombre: string, email: string, password: string, role = "ciudadano"): Promise<void> {
        if (!nombre || !email || !password || !role) {
            throw new Error("Todos los datos son requeridos")
        }

        const existUser = await this.getUserForEmail(email)
        if (existUser) {
            throw new Error("El correo electrónico ya está en uso")
        }

        const roleResult = await pool.query('SELECT id FROM roles WHERE nombre = $1', [role]);
        if (roleResult.rows.length === 0) {
            throw new Error('Rol inválido');
        }

        const roleId = roleResult.rows[0].id;
        const salt = await genSalt(10);
        const passwordHash = await hash(password, salt);
        const userId = uuidv4();
        await pool.query(`INSERT INTO users (id, nombre, email, password_hash, role_id)
            VALUES ($1, $2, $3, $4, $5)`,
            [userId, nombre, email, passwordHash, roleId]
        );
        sendEvent('user_registered', { userId, nombre, email, role });
    }
}