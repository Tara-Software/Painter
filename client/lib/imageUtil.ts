import pool from "./db";

export async function getImagesFromClothes(clothes_id:string) {
    const text = `SELECT * FROM images where clothes_id = $1`;
    const values = [clothes_id];

    return (await pool.query(text, values)).rows;
}