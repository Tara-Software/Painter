import pool from "./db";

export async function getClothesIds() {
    const text = "SELECT clothes_id FROM clothes";
    const values: any[] = [];

    const res = await pool.query(text, values);
    
    return res.rows
}

export async function getClothes(limit:number = 99) {
    let text = `SELECT * FROM clothes`;
    let values: number[] = []
    if(limit) {
        text += ` LIMIT $1`
        values = [limit];
    }

    const res = await pool.query(text, values);
    return res.rows;
}
export async function getSingleClothes(clothes_id: any) {
    const text = `SELECT * FROM clothes WHERE clothes_id = $1`;
    const values = [clothes_id];

    try {
        return (await pool.query(text, values)).rows[0];
    } catch(e) {
        return undefined;
    }
}