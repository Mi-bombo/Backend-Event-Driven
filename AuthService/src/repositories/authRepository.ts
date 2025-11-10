import { pool } from "../db/db";
import { IUser } from "../interfaces/IUser";
import { generalQueryRepository } from "./dbRepository";

export class authRepository {
    private generalQueryRepo: generalQueryRepository;

    constructor() {
        this.generalQueryRepo = new generalQueryRepository();
    }

    getUserForId = async (id: string): Promise<IUser | null> => {
        const result = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id]);
        return result.rows[0] || null;
    };

    getUserForEmail = async (email: string): Promise<IUser | null> => {
        const result = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
        return result.rows[0] || null;
    }

    deleteUserById = async (id: string): Promise<void> => {
        await this.generalQueryRepo.deleteItemById('usuarios', id);
    }

    getItemById = async(id:string | number, algo:string): Promise<any> => {
        return await pool.query(`SELECT * FROM ${algo} WHERE id = $1`, [id]);
    }

    getItemByIdNumber = async(id:number, algo:string): Promise<any> => {
        return await pool.query(`SELECT * FROM ${algo} WHERE id = $1`, [id]);
    }

}

