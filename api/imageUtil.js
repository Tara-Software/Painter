const { pool } = require("../config/db");
const https = require('https');
const fs = require('fs');

const registerImage = async (image) => {
    const text = `INSERT INTO images (clothes_id, url, title)
        VALUES ($1, $2, $3)
        RETURNING image_id
    `;
    const values = [image.clothes_id, image.url, image.title];
    
    try {
        return (await pool.query(text, values)).rows[0]["image_id"];
    } catch(e) {
        // console.log(e);
        return -1;
    }
}
const removeImage = async (image_id) => {
    const text = `DELETE FROM images WHERE image_id = $1`;
    const values = [image_id];

    return await pool.query(text, values);
}
const updateImageTitle = async (image_id, title) => {
    const text = `UPDATE images set title = $2 WHERE image_id = $1`;
    const values = [image_id, title.toLowerCase()];

    return await pool.query(text, values);
}
const getClothesId = async (image_id) => {
    const text = `SELECT clothes_id FROM images where image_id = $1`;
    const values = [image_id];
    try {
        return (await pool.query(text, values)).rows[0]["image_id"];
    } catch(e) {
        // console.log(e);
        return -1;
    }
}
const getImage = async (image_id) => {
    const text = `SELECT * FROM images WHERE image_id = $1`;
    const values = [image_id]

    return await pool.query(text, values);
}
const getImageId = async (image) => {
    const text = `SELECT image_id FROM images WHERE title = $1`;
    const values = [image.title];
   
    try {
        return (await pool.query(text, values)).rows[0]["image_id"];
    } catch(e) {
        return -1;
    }
}
const getImagesFromClothesId = async (clothes_id) => {
    const text = `SELECT * FROM images WHERE clothes_id = $1`;
    const values = [clothes_id];

    return (await pool.query(text, values));
}
const isImageRegistered = async (image) => {
    return (await getImageId(image)) > 0;
}

module.exports =  {
    registerImage, removeImage, updateImageTitle, getClothesId, getImage, getImageId, isImageRegistered, getImagesFromClothesId
};