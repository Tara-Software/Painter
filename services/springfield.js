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



/**
 * IMPORTANTE
 * Los datos universales se encuentran en la variable window.universal_variable.product
 * **/

var total = 0;
var registrados= 0;
var toVisit = [];
var visited = 0;
const getCategory = async (link, dict) => {
    const res = link.split("/")[6].split("-")[0];
    let category = new Category(res);
    category.includeInDictionary(dict);
    
    if(await categoryUtil.isCategoryRegistered(category)) {
        return await categoryUtil.getCategoryId(category);
    } else {
        return await categoryUtil.registerCategory(category);
    }

}
const getGender = async link => {
    // supongamos que esto siempre va a ser hombre, mujer o elle
    let gender = link.split("/")[5].split("-")[0];
    if(gender != "mujer" && gender != "hombre") {
        gender = "mujer";
    }
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
const getBrand = async brand => {
    const brand_s = brand.toLowerCase().trim();
    const b = new Brand(brand_s);
    if(await brandUtil.isBrandRegistered(b)) {
        return await brandUtil.getBrandId(b);
    } else {
        return await brandUtil.registerBrand(b);
    }
}
(async () => {
    // Categorias locas 
    const dictCategories = await categoryUtil.getDictionary();
    var dictBrands = await brandUtil.getDictionary();
    // get brand_id or register it
    // con el gender pasar?? lo mismo pero por ahor no me preocupo
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
        console.log("Url: " + url);
        await page.goto(url);
        var results = await page.evaluate(() => {
            var res = {};
            res["brand"] = document.querySelector("#pdpContent h2").innerText;
            res["title"] = document.querySelector("#pdpContent h1").innerText
            res["price"] = document.querySelector("#pdpContent span[data-price]").getAttribute("data-price");
            res["description"] = "";
            for(let s of document.querySelectorAll("#pdpDescription")) {
                res.description += s.innerText.replaceAll("...", "").trim();
            }
            let original_price = document.querySelector("#pdpContent .js-list-price");
            if(original_price) {
                res["original_price"] = original_price.innerText;
            } else {
                res["original_price"] = -1;
            }
            res["images"] = [];
            try {
                let img_container = document.querySelectorAll(".js-images-container img");
                for(let i of img_container) {
                    res["images"].push(i.src);
                }
            } catch (error) {
            }
            res["sizes"] = [];
            try {
                let sizes = document.querySelector(".js-size-selector");
                if(sizes) {
                    for (let size of sizes.querySelectorAll(".gi-sizes-mobile")) {
                        res["sizes"].push({size: size.getAttribute("data-size-id"), disabled: size.disabled});
                    }
                }
            } catch (error) {
            }
            return res;
        });
        // Esto es lo que deber??a ser
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

        dictBrands = brandUtil.getDictionary();
        //let clothes_id = -1;
        if(clothes_id > 0) {
            registrados++;
            console.log(element.name + " registrado. ID - " + clothes_id);

            // Guardar im??genes
             for(let img of results.images) {
                let image_element = new Image(clothes_id, img, element.name);
                //console.log(image_element)
                await imageUtil.registerImage(image_element);
            }
        }
    });

    // begin queue task
    const { data } = await axios.get('https://myspringfield.com/sitemap_index.xml');
    var jsonData = xml2json.toJson(data, {object: true});

    jsonData.sitemapindex.sitemap.map(( link ) => toVisit.push(link.loc));
    const startTime = new Date().getTime();

    while(visited < toVisit.length) {

        console.log(toVisit[visited]);
        const { data } = await axios.get(toVisit[visited]);
        var data_items = xml2json.toJson(data, {object: true});
        
        const elements = [];
        for (const item of data_items["urlset"]["url"]) {
            
            if(item["loc"] && item.loc.includes("https://myspringfield.com/es/es")) {
                // DAVI-33 Saltar enlace porque ya est?? registrado.
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