const pool = require("../config/db");

const registerClothes = async (clothes) => {
    const text = `
        INSERT INTO clothes (name, gender_id, category, price, size, link, description, stock, brand_id, reference)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING clothes_id
    `;
    const values = [clothes.name, clothes.gender_id, clothes.category, clothes.price, clothes.size, clothes.link, clothes.description, clothes.stock, clothes.brand_id, clothes.reference];
    
    try {
        return (await pool.query(text, values)).rows[0]["clothes_id"];
    } catch(e) {
        return -1;
    }
}
const removeClothes = async (clothes_id) => {
    const text = `DELETE FROM clothes WHERE clothes_id = $1`;
    const values = [clothes_id];

    return pool.query(text, values);
}
const updateClothesName = async (clothes_id, name) => {
    const text = `UPDATE clothes set name = $2 WHERE clothes_id = $1`;
    const values = [clothes_id, name.toLowerCase()];

    return pool.query(text, values);
}
const getClothes = async (clothes_id) => {
    const text = `SELECT * FROM clothes WHERE clothes_id = $1`;
    const values = [clothes_id]

    return pool.query(text, values);
}
const isClothesRegistered = async (link, reference) => {
    const text = `SELECT clothes_id FROM clothes WHERE link = $1 AND reference = $2`;
    const values = [link, reference];

    return (await pool.query(text, values)).rowCount > 0;
}
module.exports =  {
    registerClothes, removeClothes, updateClothesName, getClothes, isClothesRegistered
};