async function registerBrand(brand) {
    const text = `INSERT INTO brands (name)
            VALUES ($1)
            RETURNING brand_id`;
    const values = [brand.name];

    return pool.query(text, values);
}
async function registerClothing(clothes) {
    const text = `
        INSERT INTO clothes (name, gender, category, price, size, link, description, stock, brand_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING clothes_id
    `;
    const values = [clothes.name, clothes.gender, clothes.category, clothes.price, clothes.size, clothes.link, clothes.description, clothes.stock, clothes.brandId];

    return pool.query(text, values);
}

async function getBrand(brandId) {
    const text = `SELECT * FROM brands WHERE brand_id = $1`;
    const values = [brandId];

    return pool.query(text, values);
}
async function updatePersonName(personId, fullname) {
    const text = `UPDATE people SET fullname = $2 WHERE id = $1`;
    const values = [personId, fullname];

    return pool.query(text, values);
}
async function removePerson(personId) {
    const text = `DELETE FROM people WHERE id = $1`;
    const values = [personId];

    return pool.query(text, values);
}

(async () => {
    const springfield = await getBrand(1);

    console.log("Sprinfield object" + JSON.stringify(springfield.rows[0], null, " "));

    const pantalones = {
        name: "pantalones de pana", 
        gender: "m", 
        category: "pantalones",
        price: 29.99,
        size: "M", 
        link: "https://pictureofahotdog.com",
        description: "un dos tere",
        stock: "no",
        brandId: springfield.rows[0]["brand_id"]
    }
    const registerResult = await registerClothing(pantalones);
    console.log("Pantalones si o no: " + registerResult.rows[0]["clothes_id"]);

    await pool.end();
})();