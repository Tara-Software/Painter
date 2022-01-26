const pool = require("../config/db");

const register = async (clothes) => {
    const text = `
        INSERT INTO clothes (name, gender_id, category, price, size, link, description, stock, brand_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING clothes_id
    `;
    const values = [clothes.name, clothes.gender_id, clothes.category, clothes.price, clothes.size, clothes.link, clothes.description, clothes.stock, clothes.brand_id];

    return pool.query(text, values);
}
const remove = async (clothes_id) => {
    const text = `DELETE FROM clothes WHERE clothes_id = $1`;
    const values = [clothes_id];

    return pool.query(text, values);
}
const updateName = async (clothes_id, name) => {
    const text = `UPDATE clothes set name = $2 WHERE clothes_id = $1`;
    const values = [clothes_id, name.toLowerCase()];

    return pool.query(text, values);
}
const get = async (clothes_id) => {
    const text = `SELECT * FROM clothes WHERE clothes_id = $1`;
    const values = [clothes_id]

    return pool.query(text, values);
}
const isRegistered = async (clothes) => {
    const text = `SELECT clothes_id FROM clothes WHERE name = $1`;
    const values = [clothes.name];

    return (await pool.query(text, values)).rowCount > 0;
}
module.exports =  {
    register, remove, updateName, get, isRegistered
};