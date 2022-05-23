class Clothes {
    constructor(name, link) {
        this.name = name.toLowerCase();
        this.link = link;
        this.stock = 0;
    }
    setGender_id(gender_id) {
        this.gender_id = gender_id
    }

    setCategory_id(category_id) {
        this.category_id = category_id
    }
    setBrand_id(brand_id) {
        this.brand_id = brand_id
    }
    setPrice(price) {
        this.price = price
    }
    setSalePrice(sale) {
        this.sale_price = sale;
    }
    setReference(reference) {
        this.store_reference = reference;
    }
    setDescription(d) {
        this.description = d;
    }
    setSizes(s) {
        this.size = JSON.stringify(s);
    }
    setImages(i) {
        this.images = i
    }
}

module.exports = Clothes;