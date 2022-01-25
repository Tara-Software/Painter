const pool  = require("../../config/db");

async function getBrand(brandId) {
    const text = `SELECT * FROM brands WHERE brand_id = $1`;
    const values = [brandId];

    return pool.query(text, values);
}

module.exports = getBrand