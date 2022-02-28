const pool = require("../config/db");
const levenshtein = require('js-levenshtein');

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
    includeInDictionary(dict) {
        if(!dict.includes(this.name)) {
            var min = {
                brand: "",
                distance: 999
            }
            for(let b of dict) {
                let lev = levenshtein(b, this.name);
                if(lev < min.distance) {
                    min = {brand: b, distance: lev}
                }
            }
            this.name = min.brand;
        }
    }
}

module.exports = Brand;