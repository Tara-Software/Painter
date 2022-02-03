import pool from "./db";

export async function getBrandsIds() {
    const text = "SELECT brand_id FROM brands";
    const values: any[] = [];

    const res = await pool.query(text, values);
    return res.rows;
}

export async function getBrands(limit:number) {
    let text = `SELECT * FROM brands`;
    let values: number[] = []
    if(limit) {
        text += ` LIMIT $1`
        values = [limit];
    }

    const res = await pool.query(text, values);
    return res.rows;
}

export async function getBrandName(brand_id: number) {
    const text = `SELECT name FROM brands WHERE brand_id = $1`;
    const values = [brand_id];

    try {
        return (await pool.query(text, values)).rows[0];
    } catch(e) {
        return "";
    }
}