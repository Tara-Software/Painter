class Clothes {
    constructor(name, gender_id, category, brand_id, price, link, reference) {
        this.name = name.toLowerCase();
        this.gender_id = gender_id;
        this.category = category; 
        this.brand_id = brand_id; 
        this.price = price;
        this.link = link;
        this.reference = reference;
    }
}

module.exports = Clothes;