import { pool } from "../db/db";

export class generalQueryRepository {

    returnAllItems = async (tabla:string): Promise<any | null> => {
        const result = await pool.query(`SELECT * FROM ${tabla}`);
        return result.rows || null;  
    };

    deleteItemById = async (table: string, id: string): Promise<boolean> => {
        const result = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        return result.rowCount! > 0;
    }

    deleteItemByIdNumber = async (table: string, id: number): Promise<boolean> => {
        const result = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        return result.rowCount! > 0;
    }
}