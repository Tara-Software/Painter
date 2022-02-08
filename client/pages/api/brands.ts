import { NextApiRequest, NextApiResponse } from "next";
import pool from '../../lib/db'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const text = `SELECT * FROM brands`
    
    try {
        const response = await pool.query(text, []);
    
        res.status(200).send(response.rows)
    } catch(e) {
        res.status(404).send("pues no ha funcionaro")
    }
    
}