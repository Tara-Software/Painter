const pool = require("../config/db");

class Brand {
    constructor(name) {
        this.name = name.toLowerCase();
    }
    getName() {
        return this.name;
    }
    setName(name) {
       this.name = name.toLowerCase();
    }
    setBrandId(brand_id) {
        this.brand_id = brand_id;
    }
    async getBrandId() {
        return await require("../api/brand").getBrandId(this);
    }
}

module.exports = Brand;