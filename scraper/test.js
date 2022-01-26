const Ropa = require("./models/Ropa");
const getBrand = require("./routes/api/marca");

let pantalon = new Ropa("Pantalon de pana", "Pantalones", "Springfield", 29.99);


(async () => {
    let result = await getBrand(1);
    console.log(result.rows[0])
})();
