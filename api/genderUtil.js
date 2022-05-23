const { pool } = require("../config/db");

const registerGender = async (gender) => {
    const text = `INSERT INTO genders (name)
        VALUES ($1)
        RETURNING gender_id
    `;
    const values = [gender.name];
    
    try {
            return (await pool.query(text, values)).rows[0]["gender_id"];
    } catch(e) {
        console.log(e);
        return -1;
    }
}
const removeGender = async (gender_id) => {
    const text = `DELETE FROM genders WHERE gender_id = $1`;
    const values = [gender_id];

    return pool.query(text, values);
}
const updateGenderName = async (gender_id, name) => {
    const text = `UPDATE genders set name = $2 WHERE gender_id = $1`;
    const values = [gender_id, name.toLowerCase()];

    return pool.query(text, values);
}
const getGender = async (gender_id) => {
    const text = `SELECT * FROM genders WHERE gender_id = $1`;
    const values = [gender_id]

    return pool.query(text, values);
}
const getGenderId = async (gender) => {
    const text = `SELECT gender_id FROM genders WHERE name = $1`;
    const values = [gender.name];
   
    try {
        return (await pool.query(text, values)).rows[0]["gender_id"];
    } catch(e) {
        return -1;
    }
}
const isGenderRegistered = async (gender) => {
    return (await getGenderId(gender)) > 0;
}

module.exports =  {
    registerGender, removeGender, updateGenderName, getGender, getGenderId, isGenderRegistered
};