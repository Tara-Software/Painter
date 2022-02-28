const { pool } = require("../config/db");

const registerBrand = async (brand) => {
    const text = `INSERT INTO brands (name)
        VALUES ($1)
        RETURNING brand_id
    `;
    const values = [brand.name];
    
    try {
        return (await pool.query(text, values)).rows[0]["brand_id"];
    } catch(e) {
        console.log(e)
        return -1;
    }
}
const removeBrand = async (brand_id) => {
    const text = `DELETE FROM brands WHERE brand_id = $1`;
    const values = [brand_id];

    return pool.query(text, values);
}
const updateBrandName = async (brand_id, name) => {
    const text = `UPDATE brands set name = $2 WHERE brand_id = $1`;
    const values = [brand_id, name.toLowerCase()];

    return pool.query(text, values);
}
const getBrand = async (brand_id) => {
    const text = `SELECT * FROM brands WHERE brand_id = $1`;
    const values = [brand_id]

    return pool.query(text, values);
}
const getBrandId = async (brand) => {
    const text = `SELECT brand_id FROM brands WHERE name = $1`;
    const values = [brand.name];

    try {
        return (await pool.query(text, values)).rows[0]["brand_id"];
    } catch(e) {
        return -1;
    }
}
const isBrandRegistered = async (brand) => {
    return (await getBrandId(brand)) > 0;
}
const getDictionary = async () => {
    const text = `SELECT name from brands`;
    const res = (await pool.query(text, [])).rows.map((item) => item.name);

    return res;
}
module.exports =  {
    registerBrand, removeBrand, updateBrandName, getBrand, getBrandId, isBrandRegistered, getDictionary
};