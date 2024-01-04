const puppeteer = require("puppeteer");
const {calculatePmiRating, calculateUmsciRating, calculateBuildingPermitRating} = require("./rating");
const {NPMI_URL, PMI_URL} = require("./constants");

async function calculate(page, type) {
    await page.goto(type, {waitUntil: ['load', 'domcontentloaded', 'networkidle0'],timeout: 60000});
    const data = await page.evaluate((type) => {
        return new Promise(async (resolve) => {
            const row = document.querySelector("#ctl00_ContentPlaceHolder1_ctl00_ctl02_Panel1 .table tbody tr");

            if (!row) resolve(null);

            const actual = parseFloat(row.children[1].innerText.trim() || 0);
            const previous = parseFloat(row.children[2].innerText.trim() || 0);

            const actualRate = await calculate(type, actual);
            const previousRate = await calculate(type, previous);

            const result = {
                actual,
                previous,
                actualRate,
                previousRate
            };

            resolve(result);
        });
    }, type);
    return data;
}

async function executeWeb() {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.exposeFunction(`calculate`, calculateRating);

    //PMI
    const pmi = await calculate(page, PMI_URL)

    //NPMI
    const npmi = await calculate(page, NPMI_URL)

    await browser.close();
    return {pmi,npmi};
}

async function calculateRating(type, value) {
    if(type === PMI_URL || type === NPMI_URL) {
        return calculatePmiRating(value)
    }
}

module.exports = {executeWeb}
