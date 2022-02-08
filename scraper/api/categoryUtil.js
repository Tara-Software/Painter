const { pool } = require("../config/db");

const registerCategory = async (category) => {
    const text = `INSERT INTO categories (name)
        VALUES ($1)
        RETURNING category_id
    `;
    const values = [category.name];
    
    try {
            return (await pool.query(text, values)).rows[0]["category_id"];
    } catch(e) {
        // console.log(e);
        return -1;
    }
}
const removeCategory = async (category_id) => {
    const text = `DELETE FROM categories WHERE category_id = $1`;
    const values = [category_id];

    return pool.query(text, values);
}
const updateCategoryName = async (category_id, name) => {
    const text = `UPDATE categories set name = $2 WHERE category_id = $1`;
    const values = [category_id, name.toLowerCase()];

    return pool.query(text, values);
}
const getCategory = async (category_id) => {
    const text = `SELECT * FROM categories WHERE category_id = $1`;
    const values = [category_id]

    return pool.query(text, values);
}
const getCategoryId = async (category) => {
    const text = `SELECT category_id FROM categories WHERE name = $1`;
    const values = [category.name];
   
    try {
        return (await pool.query(text, values)).rows[0]["category_id"];
    } catch(e) {
        return -1;
    }
}
const isCategoryRegistered = async (category) => {
    return (await getCategoryId(category)) > 0;
}

module.exports =  {
    registerCategory, removeCategory, updateCategoryName, getCategory, getCategoryId, isCategoryRegistered
};