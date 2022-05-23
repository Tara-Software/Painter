const gunzip = require('gunzip-file')
const axios = require('axios');
const xml2json = require('xml2json');
const https = require('https')
const fs = require('fs');
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
const { url } = require('inspector');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

var total = 0;
var registrados= 0;
var toVisit = [];
var visited = 0;

const getCategory = async (c, title) => {
    /* en p&b hay 3 categorias, Ropa, Accesorios y Zapatos. 
    *  hay que definir, en caso de Ropa, a la que pertenece
    */
    var category = {name: c};
    if(c == "Ropa") {
        var category_name = title.split(" ")[0];
        category.name = category_name
    }    

    if(await categoryUtil.isCategoryRegistered(category)) {
        return await categoryUtil.getCategoryId(category);
    } else {
        return await categoryUtil.registerCategory(category);
    }

}
const getGender = async (g) => {
    
    var gender = {name: g};
    if(await genderUtil.isGenderRegistered(gender)) {
        return await genderUtil.getGenderId(gender);
    } else {
        return await genderUtil.registerGender(gender);
    }
}

const getBrand = async (b) => {
    var brand = {name: b};
    if(await brandUtil.isBrandRegistered(brand)) {
        return await brandUtil.getBrandId(brand);
    } else {
        return await brandUtil.registerBrand(brand);
    }
}

// Store link
const getReference = (link) => {
    return link.split("-").at(-1);
}

// Begin scraping
(async () => {
    // puppeteerExtra.use(pluginStealth());
    // Valores disponibles por defecto (categorías, marcas);
    const dictCategories = await categoryUtil.getDictionary();
    var dictBrands = await brandUtil.getDictionary();
    
    let brand = new Brand("")

    // begin queue task
    // https://myspringfield.com/sitemap_index.xml
    const xml_sitemap = 'https://www.pullandbear.com/2/info/sitemaps/sitemap-index-products-pb.xml';
    const { data } = await axios.get(xml_sitemap);
    
    var jsonData = xml2json.toJson(data, {object: true});

    // Get ES data
    var xml_gz = "";
    jsonData?.sitemapindex?.sitemap?.map((item) => { 
        if(item.loc.includes("-products-pb-es")) {xml_gz = item.loc}
    });
    // jsonData.sitemapindex.sitemap.map(( link ) => toVisit.push(link.loc));
    // save to FS
    const file = fs.createWriteStream("./sitemaps/result_pb.tar.gz");
    const request = https.get(xml_gz, (response) => {
        response.pipe(file);
    });
    file.on('finish', function() {
        gunzip("./sitemaps/result_pb.tar.gz", './sitemaps/sitemap_pb.xml', () => {
            // Read data
            const xml_data = fs.readFileSync('./sitemaps/sitemap_pb.xml', {encoding: 'utf-8'});
            jsonData = xml2json.toJson(xml_data, {object: true})
            // Cambiar todos los idiomas raros a ES
            const regex = /\/es\/[A-Za-z][A-Za-z]\//i

            // Comenzar parseado
            jsonData?.urlset?.url.map((item) => {
                var url = item.loc;
                if(!url.match(regex)) {
                    toVisit.push(url);
                }
                
            });
            console.log("Files to scrape: " + toVisit.length)
            beginQueue();
        });
        
    });
    // gunzip(xmlo_gz, 'sitemap.xml', () => {
    //     console.log('gunzip done!')
    // });
    async function beginQueue() {
        puppeteerExtra.use(pluginStealth());
        const browser = await puppeteerExtra.launch();
        const page = await browser.newPage()

        while(visited < toVisit.length) {
            const link = toVisit[visited];
            const registered = await clothesUtil.isClothesRegistered(link, getReference(link));
            if(!registered) {
                
                await page.goto(link);
                // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
                let jsonLD = await page.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"')?.innerText || "{}"))
                if(Object.keys(jsonLD).length == 0) {
                    console.log("Link fallado: " + link)
                    await page.screenshot({path: "test.png"})

                } else {
                    var res = {};
                    
                    let clothes = new Clothes(
                        jsonLD.name, jsonLD.offers?.url
                    );
                    clothes.setBrand_id(await getBrand(jsonLD.brand?.name));
                    clothes.setPrice(jsonLD.offers?.price);
                    clothes.setDescription(jsonLD.description);
                    clothes.setSalePrice(jsonLD.offers?.price);
                    clothes.setImages([jsonLD.image]);
                    clothes.setSizes([]);
                    clothes.setGender_id(await getGender(jsonLD.offers?.category?.split(" - ")[0]));
                    clothes.setCategory_id(await getCategory(jsonLD.offers?.category?.split(" - ")[1], jsonLD.name));
                    clothes.setReference(getReference(link));
                    
                    let clothes_id = await clothesUtil.registerClothes(clothes);
                    //let clothes_id = -1;
                    if(clothes_id > 0) {
                        registrados++;
                        console.log(clothes.name + " registrado. ID - " + clothes_id);

                        // Guardar imágenes
                        for(let img of clothes.images) {
                            let image_element = new Image(clothes_id, img, clothes.name);

                            await imageUtil.registerImage(image_element);
                        }
                    }
                }
            } else {
                // console.log("Link already visited")
            }
            visited++;
            // if(visited > 100) break
        }
        // await page.close();
        await page.close();
        await browser.close();
    }
})();