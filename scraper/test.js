const pool = require("./config/db");
const Brand = require("./models/Brand");
const brand = require("./api/brand");
const Clothes = require("./models/Clothes");
const clothes = require("./api/clothes");
const Gender = require("./models/Gender");
const gender = require("./api/gender");

(async () => {
    let zara = new Brand("Zara");
    let elle = new Gender("elle");
    let elle_id = await gender.registerGender(elle);
    console.log(elle_id);
    let zara_id = await zara.getBrandId();
    let pantalon = new Clothes("pantalon de pana", 1, "pantalon", zara_id, 19.99, "https://woowg.elñcmc" );
    let pantalon_id = await clothes.register(pantalon);
    let isIt = await brand.isBrandRegistered(zara);
    console.log(await zara.getBrandId());

    pool.end();
})();