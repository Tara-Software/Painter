const axios = require('axios');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom')
const xml2json = require('xml2json');
const puppeteer = require('puppeteer');
var toVisit = [];

var visited = 0;

const getId = link => {
    return link.split("/").at(-1).split(".html")[0];
}
const getTitle = link => {
    return link.split("/").at(-2).replaceAll("-", " ");
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

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
                const link = item["loc"];
                await page.goto(link);
            
                var price = await page.evaluate(() => document.querySelector("#pdpContent span[data-price]").getAttribute("data-price"));
        
                const element =  {
                    id: getId(link),
                    title: getTitle(link),
                    price: price,
                }
                console.log(element);
                elements.push(element);
            };
        }
        console.log(elements);
        
        visited++;
    }
    
    
    await browser.close();
})();