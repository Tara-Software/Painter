import { NextApiRequest, NextApiResponse } from "next";
import pool from '../../lib/db'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const text = `SELECT * FROM clothes LIMIT $1`
    const values = [3];
    
    try {
        const response = await pool.query(text, values);
    
        res.status(200).send(response.rows)
    } catch(e) {
        console.log(e)
        res.status(404).send("pues no ha funcionaro")

    }
    
}