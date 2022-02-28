const axios = require('axios');
const cheerio = require('cheerio');
const xml2json = require('xml2json');
const { Cluster } = require("puppeteer-cluster");

const getId = link => {
    // we will use as id the last element of the url
    var elements = link.split('/').at(-1).split('.html')[0].split('-');
    return elements[elements.length - 1];
}
const getTitle = link => {
    // there must be an easier way to do a substring until last element
    const elements = link.split('/').at(-1).split('.html')[0].split('-');
    var title = '';
    for (var i = 0; i < elements.length - 2; i++) {
        title += elements[i] + ' ';
    }
    return title;
}

const getPrice = async link => {
    // get the price from the html
    try {
        var html = await axios.get(link);
        var $ = cheerio.load(html.data);
        var price = $('.price-current__amount').html();
    } catch (e) {
        console.log('error al acceder a:' + link);
        return null;
    }
    return price;
}

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT, // 1 browser per context
        maxConcurrency: 4, // cluster with 4 workers
    });

    await cluster.task(async ({ page, data: url }) => {
        const element = {
            id: getId(url),
            title: getTitle(url),
            price: await getPrice(url),
        }

        console.log(element);
    });

    // get all clothes items url from zara sitemap
    const zaraItemsURI = 'https://www.zara.com/sitemaps/sitemap-es-es.xml';
    const { data } = await axios.get(zaraItemsURI);
    var jsonData = xml2json.toJson(data, { object: true });

    // we will go though all URIs
    for (const item of jsonData['urlset']['url']) {
        var aux = item.loc;
        // if this URI is a zara URI
        if (item['loc'] && aux.includes('https://www.zara.com/es/es/')) {
            //get the html 
            cluster.queue(item["loc"]);
        };
    }
    await cluster.idle();
    await cluster.close();
})();