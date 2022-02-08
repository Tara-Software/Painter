import pool from "./db";

export async function getGenderIds() {
    const text = "SELECT gender_id FROM genders";
    const values: any[] = [];

    const res = await pool.query(text, values);
    
    return res.rows
}
export async function getGenders(limit:number = 0) {
    let text = `SELECT * FROM genders`;
    let values: number[] = []
    if(limit > 0) {
        text += ` LIMIT $1`
        values = [limit];
    }

    const res = await pool.query(text, values);
    return res.rows;
}
export async function getGenderName(gender_id: number) {
    const text = `SELECT name FROM genders WHERE gender_id = $1`;
    const values = [gender_id];

    try {
        return (await pool.query(text, values)).rows[0].name;
    } catch(e) {
        return "";
    }
}