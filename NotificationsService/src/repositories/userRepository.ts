import { pool } from "../db/db";

export class notifRepository {
    async getUsersEmail(){
        const result = await pool.query('SELECT email from usuarios')
        return result.rows ?? []
    }

    async getUserById(id:string){
        const result = await pool.query('SELECT * from usuarios where id = $1', [id])
        return result.rows[0] ?? null
    }
}