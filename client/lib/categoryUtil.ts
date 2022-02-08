import pool from "./db";

export async function getCategoryIds() {
    const text = "SELECT category_id FROM categories";
    const values: any[] = [];

    const res = await pool.query(text, values);
    
    return res.rows
}
export async function getCategories(limit:number = 0) {
    let text = `SELECT * FROM categories`;
    let values: number[] = []
    if(limit > 0) {
        text += ` LIMIT $1`
        values = [limit];
    }

    const res = await pool.query(text, values);
    return res.rows;
}
export async function getCategoryName(category_id: number) {
    const text = `SELECT name FROM categories WHERE category_id = $1`;
    const values = [category_id];

    try {
        return (await pool.query(text, values)).rows[0].name;
    } catch(e) {
        return "";
    }
}
