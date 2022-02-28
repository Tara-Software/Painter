const levenshtein = require("js-levenshtein");
class Category {
    constructor(name) {
        this.name = name;
    }
    includeInDictionary(dict) {
        var lev = {
            category: "",
            distance: 999
        };
        if(dict.includes(this.name)) {
            return;
        }
        for(let category of dict) {
            let l = levenshtein(category, this.name);
            if(l < (lev.distance)) {
                lev = {category: category, distance: l}
            } 
        }
        if(lev.distance < 4) {
            this.name = lev.category;
        } else {
            this.name = "tendencias"
        }
    }
}

module.exports = Category;