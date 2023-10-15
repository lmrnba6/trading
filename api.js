const puppeteer = require('puppeteer');
const axios = require('axios');
const express = require('express');
const app = express();
const PORT = 3000;
let data = {}

async function getData() {
    // Start the browser and open a new page
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Set a common User-Agent to reduce chances of being blocked
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to the desired website
    await page.goto('https://tradingeconomics.com/united-states/manufacturing-pmi', { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });

    // Extract the data using our new logic
    const manufacturing = await page.evaluate(() => {
        const row = document.querySelector("#ctl00_ContentPlaceHolder1_ctl00_ctl02_Panel1 .table tbody tr");

        if (!row) return null;

        const actual = parseFloat(row.children[1].innerText.trim() || 0);
        const previous = parseFloat(row.children[2].innerText.trim() || 0);

        function calcRate(value){
            const r = Math.round((value - 50) / 2); // New rate calculation
            return Math.max(-10, Math.min(r, 10)); // Clamping the rate between -10 and 10
        }
     
        const actualRate = calcRate(actual)
        const previousRate = calcRate(previous)
    
        const result = {
            actual,
            previous,
            actualRate,
            previousRate
        };
        
        return result;
    });

    await page.goto('https://tradingeconomics.com/united-states/non-manufacturing-pmi', { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });

    const nonManufacturing = await page.evaluate(() => {
        const row = document.querySelector("#ctl00_ContentPlaceHolder1_ctl00_ctl02_Panel1 .table tbody tr");

        if (!row) return null;

        const actual = parseFloat(row.children[1].innerText.trim() || 0);
        const previous = parseFloat(row.children[2].innerText.trim() || 0);
        
        function calcRate(value){
            const r = Math.round((value - 50) / 2); // New rate calculation
            return Math.max(-10, Math.min(r, 10)); // Clamping the rate between -10 and 10
        }
     
        const actualRate = calcRate(actual)
        const previousRate = calcRate(previous)
    
        const result = {
            actual,
            previous,
            actualRate,
            previousRate
        };
        
        return result;
    });

    await page.goto('https://tradingeconomics.com/united-states/consumer-confidence', { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });

    const consumerConfidence = await page.evaluate(() => {
        const row = document.querySelector("#ctl00_ContentPlaceHolder1_ctl00_ctl02_Panel1 .table tbody tr");

        if (!row) return null;

        const actual = parseFloat(row.children[1].innerText.trim() || 0);
        const previous = parseFloat(row.children[2].innerText.trim() || 0);

        function calcRate(value){
            const r = Math.round((value - 80) / 2); // New rate calculation
            return Math.max(-10, Math.min(r, 10)); // Clamping the rate between -10 and 10
        }

        const actualRate = calcRate(actual)
        const previousRate = calcRate(previous)
    
        const result = {
            actual,
            previous,
            actualRate,
            previousRate
        };
        
        return result;
    });

    await page.goto('https://tradingeconomics.com/united-states/building-permits', { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });

    const buildingPermit = await page.evaluate(() => {
        const row = document.querySelector("#ctl00_ContentPlaceHolder1_ctl00_ctl02_Panel1 .table tbody tr");

        if (!row) return null;

        const actual = parseFloat(row.children[1].innerText.trim() || 0);
        const previous = parseFloat(row.children[2].innerText.trim() || 0);
      
        function calculateRate(value) {
            if (value >= 2200) return 10;
            if (value >= 2100) return 9;
            if (value >= 2000) return 8;
            if (value >= 1900) return 7;
            if (value >= 1800) return 6;
            if (value >= 1700) return 5;
            if (value >= 1600) return 4;
            if (value >= 1500) return 3;
            if (value >= 1400) return 2;
            if (value >= 1300) return 1;
            if (value >= 1200) return 0;
            if (value >= 1150) return -1;
            if (value >= 1100) return -2;
            if (value >= 1050) return -3;
            if (value >= 1000) return -4;
            if (value >= 950) return -5;
            if (value >= 900) return -6;
            if (value >= 850) return -7;
            if (value >= 800) return -8;
            if (value >= 750) return -9;
            return -10;  // Anything less than 750 will return -10
        }
        
        const actualRate = calculateRate(actual);
        const previousRate = calculateRate(previous);
    
        const result = {
            actual,
            previous,
            actualRate,
            previousRate
        };
        
        return result;
    });


    // const umcsi = await axios('https://api.tradingeconomics.com/fred/historical/umcsent?c=177352976e1a445:glrec19keiykbu8')
    // const realRetail = await axios('https://api.tradingeconomics.com/fred/historical/rrsfs?c=177352976e1a445:glrec19keiykbu8')
    
    console.log('manufacturing',manufacturing);
    console.log('non-manufacturing',nonManufacturing);
    console.log('consumer-confidence',consumerConfidence);
    console.log('building-permit',buildingPermit);
    // console.log('umcsi',umcsi?.data?.length ? umcsi?.data[umcsi?.data?.length - 1] : '');
    // console.log('realRetail',realRetail?.data?.length ? realRetail?.data[realRetail?.data?.length - 1] : '');

    const actualTotal = manufacturing.actualRate + nonManufacturing.actualRate + consumerConfidence.actualRate + buildingPermit.actualRate
    const previousTotal = manufacturing.previousRate + nonManufacturing.previousRate + consumerConfidence.previousRate + buildingPermit.previousRate
    const actualPourcentage = Math.abs(actualTotal / 40) * 100
    const previousPourcentage = Math.abs(previousTotal / 40) * 100

    data =  {
        manufacturing,nonManufacturing,consumerConfidence,buildingPermit, actualPourcentage, actualTotal, previousPourcentage, previousTotal
    }
    
    await browser.close();
}

app.get('/', async (req, res) => {
    const htmlContent = `
    <html>
    <h1>Matrix</h1>
    <head>
        <title>Matrix</title>
        <style>
            td, th {
                text-align: center;
                vertical-align: middle;
            }
            .left-align {
                text-align: left;
            }
        </style>
    </head>
    <body>
        <table border="1">
            <thead>
                <tr>
                    <th></th>
                    <th>Type</th>
                    <th>Indicator</th>
                    <th>Actual</th>
                    <th>Previous</th>
                    <th>Rating</th>
                    <th>Prev</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="3" class="left-align">Leading Indicators</td>
                    <td rowspan="3">Survey</td>
                    <td>ISM MAN PMI</td>
                    <td>${data.manufacturing.actual}</td>
                    <td>${data.manufacturing.previous}</td>
                    <td>${data.manufacturing.actualRate}</td>
                    <td>${data.manufacturing.previousRate}</td>
                </tr>
                <tr>
                    <td>ISM NMI</td>
                    <td>${data.nonManufacturing.actual}</td>
                    <td>${data.nonManufacturing.previous}</td>
                    <td>${data.nonManufacturing.actualRate}</td>
                    <td>${data.nonManufacturing.previousRate}</td>
                </tr>
                <tr>
                    <td>UMCSI</td>
                    <td>${data.consumerConfidence.actual}</td>
                    <td>${data.consumerConfidence.previous}</td>
                    <td>${data.consumerConfidence.actualRate}</td>
                    <td>${data.consumerConfidence.previousRate}</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td>Building Permits</td>
                    <td>${data.buildingPermit.actual}</td>
                    <td>${data.buildingPermit.previous}</td>
                    <td>${data.buildingPermit.actualRate}</td>
                    <td>${data.buildingPermit.previousRate}</td>
                </tr>
                <tr>
                    <td colspan="5">Total (btw 40 & -40)</td>                    
                    <td>${data.actualTotal}</td>
                    <td>${data.previousTotal}</td>
                </tr>
                <tr>
                    <td colspan="5">Poucentage</td>
                    <td>${data.actualPourcentage}%</td>
                    <td>${data.previousPourcentage}%</td>
                </tr>
            </tbody>
        </table>
    </body>
</html>

    `;

    res.send(htmlContent);
});


app.listen(PORT, () => {
    getData()
    console.log(`Server is running on http://localhost:${PORT}`);
});
