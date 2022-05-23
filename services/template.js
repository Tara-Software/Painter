const gunzip = require('gunzip-file')
const axios = require('axios');
const xml2json = require('xml2json');
const Clothes = require('../models/Clothes');
const Brand = require('../models/Brand');
const Gender = require("../models/Gender");
const Category = require("../models/Category");
const Image = require("../models/Image");

const brandUtil = require("../api/brandUtil");
const clothesUtil = require("../api/clothesUtil");
const genderUtil = require("../api/genderUtil");
const categoryUtil = require('../api/categoryUtil');
const imageUtil = require("../api/imageUtil");

const { Cluster } = require("puppeteer-cluster");

var total = 0;
var registrados= 0;
var toVisit = [];
var visited = 0;

const getCategory = async () => {
    var category;

    if(await categoryUtil.isCategoryRegistered(category)) {
        return await categoryUtil.getCategoryId(category);
    } else {
        return await categoryUtil.registerCategory(category);
    }

}
const getGender = async () => {
    
    var gender;
    if(await genderUtil.isGenderRegistered(gender)) {
        return await genderUtil.getGenderId(gender);
    } else {
        return await genderUtil.registerGender(gender);
    }
}

const getBrand = async () => {
    var brand;
    if(await brandUtil.isBrandRegistered(brand)) {
        return await brandUtil.getBrandId(brand);
    } else {
        return await brandUtil.registerBrand(brand);
    }
}

// Store link
const getReference = () => {
    return ""
}

// Begin scraping
(async () => {
    // Valores disponibles por defecto (categorías, marcas);
    const dictCategories = await categoryUtil.getDictionary();
    var dictBrands = await brandUtil.getDictionary();
    
    let brand = new Brand("")

    // Inicializo cluster.
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT, // 1 browser per worker
        maxConcurrency: 4, // cluster with 4 workers
    })
    
    // Define a task for every page
    await cluster.task(async ({ page, data }) => {
        let url = data["loc"];
        console.log("Url: " + url);
        await page.goto(url);
        var results = await page.evaluate(() => {
            var res = {};
            // EJEMPLO: document.querySelector("#pdpContent h2").innerText;
            res["brand"] = "";
            res["title"] = "";
            res["price"] = "";
            res["description"] = "";
            res["original_price"] = 0
            res["images"] = [];
            res["sizes"] = [];

            return res;
        });
        // Una vez se obtienen los datos de la pagina, se añaden a la BBDD

        let element = new Clothes(
            results["title"], 
            await getGender(url), 
            await getCategory(url, dictCategories), 
            await getBrand(results["brand"], dictBrands), 
            results["price"], 
            results["original_price"], 
            url, 
            getReference(url));

        element.setDescription(results["description"]);
        element.setSizes(results.sizes);

        let clothes_id = await clothesUtil.registerClothes(element);

        //let clothes_id = -1;
        if(clothes_id > 0) {
            registrados++;
            console.log(element.name + " registrado. ID - " + clothes_id);

            // Guardar imágenes
             for(let img of results.images) {
                let image_element = new Image(clothes_id, img, element.name);
                //console.log(image_element)
                await imageUtil.registerImage(image_element);
            }
        }
    });

    // begin queue task
    // https://myspringfield.com/sitemap_index.xml
    const xml_sitemap = '';
    const { data } = await axios.get(xml_sitemap);
    var jsonData = xml2json.toJson(data, {object: true});

    // jsonData.sitemapindex.sitemap.map(( link ) => toVisit.push(link.loc));

    const startTime = new Date().getTime();

    while(visited < toVisit.length) {

        const { data } = await axios.get(toVisit[visited]);
        var data_items = xml2json.toJson(data, {object: true});
        
        const elements = [];
        for (const item of data_items["urlset"]["url"]) {
            
            if(item["loc"] && item.loc.includes("https://myspringfield.com/es/es")) {
                // DAVI-33 Saltar enlace porque ya está registrado.
                let registered = await clothesUtil.isClothesRegistered(item["loc"], getReference(item["loc"]));
                if(!registered) {
                    cluster.queue(item);
                }
                total++;
            };
        }
        visited++;
    }
    await cluster.idle();
    await cluster.close();
 
    console.log("Links Totales: " + total);
    console.log("Ropas registradas: " + registrados);
    console.log(new Date().getTime() - startTime);
})();