class Clothes {
    constructor(name, gender_id, category_id, brand_id, price, link, reference) {
        this.name = name.toLowerCase();
        this.gender_id = gender_id;
        this.category_id = category_id; 
        this.brand_id = brand_id; 
        this.price = price;
        this.link = link;
        this.store_reference = reference;
        this.stock = 0;
        this.description = "";
        this.size = "L"
    }
}

module.exports = Clothes;