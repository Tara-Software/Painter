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

const getTitle = link => {
    return link.split("/").at(-2).replaceAll("-", " ");
}
const getCategory = async link => {
    const res = link.split("/")[6];
    let category = new Category(res);
    
    if(await categoryUtil.isCategoryRegistered(category)) {
        return await categoryUtil.getCategoryId(category);
    } else {
        return await categoryUtil.registerCategory(category);
    }

}
const getGender = async link => {
    // supongamos que esto siempre va a ser hombre, mujer o elle
    let gender = link.split("/")[5].replaceAll("fragancias-", "");
    
    const gender_anonimo = new Gender(gender);
    
    if(await genderUtil.isGenderRegistered(gender_anonimo)) {
        return await genderUtil.getGenderId(gender_anonimo);
    } else {
        return await genderUtil.registerGender(gender_anonimo);
    }
}
const getReference = link => {
    return "SP-" + link.split("/").at(-1).replaceAll(".html", "");
}

(async () => {
    
    // get brand_id or register it
    // con el gender pasará lo mismo pero por ahor no me preocupo
    let springfield = new Brand("springfield");
    let brand_id = -1;
    if(await brandUtil.isBrandRegistered(springfield)) {
        brand_id = await brandUtil.getBrandId(springfield);
    } else {
        brand_id = await brandUtil.registerBrand(springfield);
    }
    
    // Inicializo cluster.
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT, // 1 browser per worker
        maxConcurrency: 4, // cluster with 4 workers
    })
    
    // Define a task for every page
    await cluster.task(async ({ page, data }) => {
        let url = data["loc"];
        let images = data["image:image"]
        await page.goto(url);
        var price = await page.evaluate(() => document.querySelector("#pdpContent span[data-price]").getAttribute("data-price"));

        // Esto es lo que debería ser
        let element = new Clothes(getTitle(url), await getGender(url), await getCategory(url), brand_id, price, url, getReference(url));

        let clothes_id = await clothesUtil.registerClothes(element);
        if(clothes_id > 0) {
            registrados++;
            console.log(element.name + " registrado. ID - " + clothes_id);

             // Guardar imágenes
             for(let img of images) {
                let image_element = new Image(clothes_id, img["image:loc"], img["image:title"]);
                await imageUtil.registerImage(image_element);
            }
        }
    });

    const { data } = await axios.get('https://myspringfield.com/sitemap_index.xml');
    var jsonData = xml2json.toJson(data, {object: true});

    jsonData.sitemapindex.sitemap.map(( link ) => toVisit.push(link.loc));
    
    const startTime = new Date().getTime();
    // Mejorar esto que no me mola
    while(visited < toVisit.length) {
        console.log(toVisit[visited]);
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