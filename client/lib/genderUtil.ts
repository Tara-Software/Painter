import pool from "./db";

export async function getGenderIds() {
    const text = "SELECT gender_id FROM genders";
    const values: any[] = [];

    const res = await pool.query(text, values);
    
    return res.rows
}
export async function getGenderName(gender_id: number) {
    const text = `SELECT name FROM genders WHERE gender_id = $1`;
    const values = [gender_id];

    try {
        return (await pool.query(text, values)).rows[0];
    } catch(e) {
        return "";
    }
}