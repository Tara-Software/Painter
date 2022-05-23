const pool = require("../config/db");
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const puppeteer = require('puppeteer');
(async () => {
    puppeteerExtra.use(pluginStealth());

    // "https://www.pullandbear.com/es/blusa-plisada-botones-l04247331"
	const browser = await puppeteerExtra.launch({ headless: false });

	const url = "https://www.pullandbear.com/es/blusa-plisada-botones-l04247331";

	for (let i = 0; i < 1; i++) {
		const page = await browser.newPage();

		await page.goto(url);

		await page.waitFor(1500);

		await page.close();
	}

	await browser.close();
    
})();