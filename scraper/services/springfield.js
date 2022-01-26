const axios = require('axios');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom')
const xml2json = require('xml2json');
const puppeteer = require('puppeteer');
const Ropa = require('../models/Ropa');
const { Cluster } = require("puppeteer-cluster");

var toVisit = [];

var visited = 0;

const getId = link => {
    return link.split("/").at(-1).split(".html")[0];
}
const getTitle = link => {
    return link.split("/").at(-2).replaceAll("-", " ");
}

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT, // 1 browser per context
        maxConcurrency: 4, // cluster with 4 workers
    });

    // Define a task for every page
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        var price = await page.evaluate(() => document.querySelector("#pdpContent span[data-price]").getAttribute("data-price"));

        const element =  {
            id: getId(url),
            title: getTitle(url),
            price: price,
        }
        // Esto es lo que debería ser
        //let element = new Ropa(getTitle(link), getCategory(link), getBrand(link), price);
        console.log(element);
    });

    // begin queue task
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
                // console.log("Queued " + item["loc"]);
            };
        }
        visited++;
    }
    
    await cluster.idle();
    await cluster.close();
})();