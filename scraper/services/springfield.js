const axios = require('axios');
const xml2json = require('xml2json');

const Clothes = require('../models/Clothes');
const Brand = require('../models/Brand');
const Gender = require("../models/Gender");
const brandUtil = require("../api/brandUtil");
const clothesUtil = require("../api/clothesUtil");
const genderUtil = require("../api/genderUtil");

const { Cluster } = require("puppeteer-cluster");

var total = 0;
var registrados= 0;

var toVisit = [];

var visited = 0;

const getTitle = link => {
    return link.split("/").at(-2).replaceAll("-", " ");
}
const getCategory = link => {
    return link.split("/")[6];
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
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        var price = await page.evaluate(() => document.querySelector("#pdpContent span[data-price]").getAttribute("data-price"));

        // Esto es lo que debería ser
        let element = new Clothes(
            getTitle(url), 
            await getGender(url), 
            getCategory(url), 
            brand_id, 
            price, 
            url, 
            getReference(url));

        let clothes_id = await clothesUtil.registerClothes(element);
    
        if(clothes_id > 0) {
            registrados++;
            console.log(element.name + " registrado. ID - " + clothes_id);
        }
    });

    const { data } = await axios.get('https://myspringfield.com/sitemap_index.xml');
    var jsonData = xml2json.toJson(data, {object: true});

    jsonData.sitemapindex.sitemap.map(( link ) => toVisit.push(link.loc));

    while(visited < 1) {
        // console.log("Visiting: " + toVisit[visited]);
        console.log(toVisit[visited]);
        const { data } = await axios.get(toVisit[visited]);
        var data_items = xml2json.toJson(data, {object: true});
        
        const elements = [];
        for (const item of data_items["urlset"]["url"]) {
            if(item["loc"] && item.loc.includes("https://myspringfield.com/es/es")) {
                cluster.queue(item["loc"]);
                total++;
            };
        }
        visited++;
    }
    
    await cluster.idle();
    console.log("Links Totales: " + total);
    console.log("Ropas registradas: " + registrados);
    await cluster.close();
})();