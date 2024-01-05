const express = require('express');
const app = express();
app.use(express.json());
const PORT = 3000;
const {executeWeb} = require("./calculationWeb");
const {executeApi} = require("./calculationApi");
const {main} = require("./cftc");


async function getData() {
    let result = {}
    let data = {}
    let html = ``
    let cftc = ''

    const {pmi, npmi} = await executeWeb()

    const {nfp, ijc, cpi, ccpi, ppi, cppi, cpe, ccpe, bp, umcsi, ip, gdp, bop, housing, retail, gdpgnp, deficit,us10,interest,liquidity,m2,dff,walcl} = await executeApi()

    cftc = await main()
    console.log('**********DONE**********');

    //MATRIX

    //Leading
    const actualTotalLeading = pmi?.actualRate + npmi?.actualRate + umcsi?.actualRate + bp?.actualRate
    const previousTotalLeading = pmi?.previousRate + npmi?.previousRate + umcsi?.previousRate + bp?.previousRate
    const actualPercentageLeading = Math.abs(actualTotalLeading / 40) * 100
    const previousPercentageLeading = Math.abs(previousTotalLeading / 40) * 100

    //Coincident
    const actualTotalCoincident = nfp?.actualRate + ijc?.actualRate + cpi?.actualRate + ccpi?.actualRate + ppi?.actualRate + cppi?.actualRate + cpe?.actualRate + ccpe?.actualRate + ip?.actualRate + gdp?.actualRate + bop?.actualRate + housing?.actualRate + retail?.actualRate
    const previousTotalCoincident = nfp?.previousRate + ijc?.previousRate + cpi?.previousRate + ccpi?.previousRate + ppi?.previousRate + cppi?.previousRate + cpe?.previousRate + ccpe?.previousRate + ip?.previousRate + gdp?.previousRate + bop?.previousRate + housing?.previousRate + retail?.previousRate
    const actualPercentageCoincident = Number(Math.abs(actualTotalCoincident / 130) * 100).toFixed(2)
    const previousPercentageCoincident = Number(Math.abs(previousTotalCoincident / 130) * 100).toFixed(2)
    
    //Fed
    const actualTotalFed = gdpgnp?.actualRate + deficit?.actualRate + us10?.actualRate + interest?.actualRate + liquidity?.actualRate + m2?.actualRate + dff?.actualRate + walcl?.actualRate
    const previousTotalFed = gdpgnp?.previousRate + deficit?.previousRate + us10?.previousRate + interest?.previousRate + liquidity?.previousRate + m2?.previousRate + dff?.previousRate + walcl?.previousRate
    const actualPercentageFed = Number(Math.abs(actualTotalFed / 75) * 100).toFixed(2)
    const previousPercentageFed = Number(Math.abs(previousTotalFed / 75) * 100).toFixed(2)

    //Total
    const actualTotal = actualTotalLeading + actualTotalCoincident + actualTotalFed;
    const previousTotal = previousTotalLeading + previousTotalCoincident + previousTotalFed;
    const actualGrowth = ip.actualRate + gdp.actualRate;
    const previousGrowth = ip.previousRate + gdp.previousRate;
    const actualInflation = cpi.actualRate + ccpi.actualRate + ppi.actualRate + cppi.actualRate + cpe.actualRate + ccpe.actualRate;
    const previousInflation = cpi.previousRate + ccpi.previousRate + ppi.previousRate + cppi.previousRate + cpe.previousRate + ccpe.previousRate;

    result = cftc.data
    result.usd = data.actualTotal > data.previousTotal ? 'LONG' : 'SHORT'

    //Data
    data = {
        pmi,
        npmi,
        umcsi,
        bp,
        nfp,
        ijc,
        cpi,
        ccpi,
        ppi,
        cppi,
        cpe,
        ccpe,
        ip,
        gdp,
        bop,
        housing,
        retail,
        gdpgnp,
        deficit,
        us10,
        interest,
        liquidity,
        m2,
        dff,
        walcl,
        actualPercentageLeading,
        actualTotalLeading,
        previousPercentageLeading,
        previousTotalLeading,
        actualPercentageCoincident,
        actualTotalCoincident,
        previousPercentageCoincident,
        previousTotalCoincident,
        actualTotalFed,
        previousTotalFed,
        actualPercentageFed,
        previousPercentageFed,
        actualTotal,
        previousTotal,
        actualGrowth,
        previousGrowth,
        actualInflation,
        previousInflation
    }

    html = `
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
                    <th>Date</th>
                    <th>Actual</th>
                    <th>Previous</th>
                    <th>Rating</th>
                    <th>Prev</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="6" class="left-align">Leading Indicators</td>
                    <td rowspan="4">Survey</td>
                    <td>ISM MAN PMI</td>
                    <td></td>
                    <td>${data.pmi?.actual}</td>
                    <td>${data.pmi?.previous}</td>
                    <td>${data.pmi?.actualRate}</td>
                    <td>${data.pmi?.previousRate}</td>
                </tr>
                <tr>
                    <td>ISM NMI</td>
                    <td></td>
                    <td>${data.npmi?.actual}</td>
                    <td>${data.npmi?.previous}</td>
                    <td>${data.npmi?.actualRate}</td>
                    <td>${data.npmi?.previousRate}</td>
                </tr>
                <tr>
                    <td>UMCSI</td>
                    <td>${data.umcsi?.date}</td>
                    <td>${data.umcsi?.actual}</td>
                    <td>${data.umcsi?.previous}</td>
                    <td>${data.umcsi?.actualRate}</td>
                    <td>${data.umcsi?.previousRate}</td>
                </tr>
                <tr>
                    <td>Building Permits</td>
                    <td>${data.bp?.date}</td>
                    <td>${data.bp?.actual}</td>
                    <td>${data.bp?.previous}</td>
                    <td>${data.bp?.actualRate}</td>
                    <td>${data.bp?.previousRate}</td>

                </tr>
                <tr>
                    <td colspan="5">Total (btw 40 & -40)</td>                    
                    <td>${data?.actualTotalLeading}</td>
                    <td>${data?.previousTotalLeading}</td>
                </tr>
                <tr>
                    <td colspan="5">Poucentage</td>
                    <td>${data?.actualPercentageLeading}%</td>
                    <td>${data?.previousPercentageLeading}%</td>
                </tr>
                 <tr>
                    <td rowspan="15" class="left-align">Coincident Indicators</td>
                    <td rowspan="2">Employment</td>
                    <td>NFP</td>
                    <td>${data.nfp?.date}</td>
                    <td>${data.nfp?.actual}</td>
                    <td>${data.nfp?.previous}</td>
                    <td>${data.nfp?.actualRate}</td>
                    <td>${data.nfp?.previousRate}</td>

                </tr>
                <tr>                 
                    <td>IJC</td>
                    <td>${data.ijc?.date}</td>
                    <td>${data.ijc?.actual}</td>
                    <td>${data.ijc?.previous}</td>
                    <td>${data.ijc?.actualRate}</td>
                    <td>${data.ijc?.previousRate}</td>

                </tr>
                 <tr>
                    <td rowspan="6">Inflation</td>
                    <td>CPI</td>
                    <td>${data.cpi?.date}</td>
                    <td>${data.cpi?.actualPercentage || ''}</td>
                    <td>${data.cpi?.previousPercentage || ''}</td>
                    <td>${data.cpi?.actualRate}</td>
                    <td>${data.cpi?.previousRate}</td>

                </tr>
                  <tr>
                    <td>Core CPI</td>
                    <td>${data.ccpi?.date}</td>
                    <td>${data.ccpi?.actualPercentage || ''}</td>
                    <td>${data.ccpi?.previousPercentage || ''}</td>
                    <td>${data.ccpi?.actualRate}</td>
                    <td>${data.ccpi?.previousRate}</td>

                </tr>
                <tr>
                    <td>PPI</td>
                    <td>${data.ppi?.date}</td>
                    <td>${data.ppi?.actualPercentage || ''}</td>
                    <td>${data.ppi?.previousPercentage || ''}</td>
                    <td>${data.ppi?.actualRate}</td>
                    <td>${data.ppi?.previousRate}</td>
                </tr>
                <tr>
                    <td>Core PPI</td>
                    <td>${data.cppi?.date}</td>
                    <td>${data.cppi?.actualPercentage || ''}</td>
                    <td>${data.cppi?.previousPercentage || ''}</td>
                    <td>${data.cppi?.actualRate}</td>
                    <td>${data.cppi?.previousRate}</td>
                </tr>
                <tr>
                    <td>CPE</td>
                    <td>${data.cpe?.date}</td>
                    <td>${data.cpe?.actualPercentage || ''}</td>
                    <td>${data.cpe?.previousPercentage || ''}</td>
                    <td>${data.cpe?.actualRate}</td>
                    <td>${data.cpe?.previousRate}</td>
                </tr>
                  <tr>
                    <td>Core CPE</td>
                    <td>${data.ccpe?.date}</td>
                    <td>${data.ccpe?.actualPercentage || ''}</td>
                    <td>${data.ccpe?.previousPercentage || ''}</td>
                    <td>${data.ccpe?.actualRate}</td>
                    <td>${data.ccpe?.previousRate}</td>

                </tr>
                <tr>
                    <td rowspan="2">Growth</td>
                    <td>Industrial Production</td>
                    <td>${data.ip?.date}</td>
                    <td>${data.ip?.actualPercentage || ''}</td>
                    <td>${data.ip?.previousPercentage || ''}</td>
                    <td>${data.ip?.actualRate}</td>
                    <td>${data.ip?.previousRate}</td>
                </tr>
                <tr>
                    <td>GDP</td>
                    <td>${data.gdp?.date}</td>
                    <td>${data.gdp?.actualPercentage || ''}</td>
                    <td>${data.gdp?.previousPercentage || ''}</td>
                    <td>${data.gdp?.actualRate}</td>
                    <td>${data.gdp?.previousRate}</td>
                </tr>
                <tr>
                    <td rowspan="1">BOP</td>
                    <td>Current account / GDP</td>
                    <td>${data.bop?.date}</td>
                    <td>${data.bop?.actual}</td>
                    <td>${data.bop?.previous}</td>
                    <td>${data.bop?.actualRate}</td>
                    <td>${data.bop?.previousRate}</td>
                </tr>
                <tr>
                    <td rowspan="1">Housing</td>
                    <td>Housing Starts</td>
                    <td>${data.housing?.date}</td>
                    <td>${data.housing?.actual}</td>
                    <td>${data.housing?.previous}</td>
                    <td>${data.housing?.actualRate}</td>
                    <td>${data.housing?.previousRate}</td>
                </tr>
                 <tr>
                    <td rowspan="1">Consumption</td>
                    <td>Retail sales</td>
                    <td>${data.retail?.date}</td>
                    <td>${data.retail?.actualPercentage || ''}</td>
                    <td>${data.retail?.previousPercentage || ''}</td>
                    <td>${data.retail?.actualRate}</td>
                    <td>${data.retail?.previousRate}</td>
                </tr>
                <tr>
                    <td colspan="5">Total (btw 130 & -130)</td>                    
                    <td>${data?.actualTotalCoincident}</td>
                    <td>${data?.previousTotalCoincident}</td>
                </tr>
                <tr>
                    <td colspan="5">Poucentage</td>
                    <td>${data?.actualPercentageCoincident}%</td>
                    <td>${data?.previousPercentageCoincident}%</td>
                </tr>
                <tr>
                    <td rowspan="5" class="left-align">Injections & Withdrawls</td>
                    <td rowspan="5">GOV (fiscal policy)</td>
                    <td>GOV debt to GDP Ratio</td>
                    <td>${data.gdpgnp?.date}</td>
                     <td>${data.gdpgnp?.actualPercentage || ''}</td>
                    <td>${data.gdpgnp?.previousPercentage || ''}</td>
                    <td>${data.gdpgnp?.actualRate}</td>
                    <td>${data.gdpgnp?.previousRate}</td>

                </tr>
                  <tr>
                    <td>SURPLUS / DEFICIT AS % OF GDP</td>
                    <td>${data.deficit?.date}</td>
                     <td>${data.deficit?.actualPercentage || ''}</td>
                    <td>${data.deficit?.previousPercentage || ''}</td>
                    <td>${data.deficit?.actualRate}</td>
                    <td>${data.deficit?.previousRate}</td>

                </tr>
                <tr>
                    <td>US 10 YEARS TREASURY BENCHMARK</td>
                    <td>${data.us10?.date}</td>
                     <td>${data.us10?.actual + '%' || ''}</td>
                    <td>${data.us10?.previous + '%' || ''}</td>
                    <td>${data.us10?.actualRate}</td>
                    <td>${data.us10?.previousRate}</td>

                </tr>
                 <tr>
                    <td>Interest bill to GDP</td>
                    <td>${data.interest?.date}</td>
                     <td>${data.interest?.actualPercentage || ''}</td>
                    <td>${data.interest?.previousPercentage || ''}</td>
                    <td>${data.interest?.actualRate}</td>
                    <td>${data.interest?.previousRate}</td>

                </tr>
                 <tr>
                    <td>Liquidity cover</td>
                    <td>${data.liquidity?.date}</td>
                     <td>${data.liquidity?.actual || ''}</td>
                    <td>${data.liquidity?.previous || ''}</td>
                    <td>${data.liquidity?.actualRate}</td>
                    <td>${data.liquidity?.previousRate}</td>

                </tr>
                 <tr>
                    <td rowspan="5" class="left-align">React to the actual situation and watch leading indicators,</td>
                    <td rowspan="3">Central bank (monetary policy)</td>
                    <td>M2  money supply</td>
                    <td>${data.m2?.date}</td>
                     <td>${data.m2?.actualPercentage || ''}</td>
                    <td>${data.m2?.previousPercentage || ''}</td>
                    <td>${data.m2?.actualRate}</td>
                    <td>${data.m2?.previousRate}</td>
                 </tr>

                 <tr>
                    <td>IR</td>
                    <td>${data.dff?.date}</td>
                     <td>${data.dff?.actual || ''}</td>
                    <td>${data.dff?.previous || ''}</td>
                    <td>${data.dff?.actualRate}</td>
                    <td>${data.dff?.previousRate}</td>
                 </tr>
                   <tr>
                    <td>CENTRAL BANK BALANCE SHEET</td>
                    <td>${data.walcl?.date}</td>
                     <td>${data.walcl?.actualPercentage || ''}</td>
                    <td>${data.walcl?.previousPercentage || ''}</td>
                    <td>${data.walcl?.actualRate}</td>
                    <td>${data.walcl?.previousRate}</td>
                 </tr>
                 <tr>
                    <td colspan="5">Total (btw 70 & -80)</td>                    
                    <td>${data?.actualTotalFed}</td>
                    <td>${data?.previousTotalFed}</td>
                </tr>
                <tr>
                    <td colspan="5">Poucentage</td>
                    <td>${data?.actualPercentageFed}%</td>
                    <td>${data?.previousPercentageFed}%</td>
                </tr>
                <tr>
                    <td rowspan="5" colspan="5" class="left-align">Total</td>
                    <td>Total</td>
                    <td>${data.actualTotal}</td>
                     <td>${data.previousTotal}</td >    
                     <td style="background-color: ${data.actualTotal > data.previousTotal ? 'lightgreen' : 'lightcoral'}">${data.actualTotal > data.previousTotal ? 'UP' : 'DOWN'}</td>                                  
                 </tr>
                 <tr>
                   
                    <td>Growth</td>
                    <td>${data.actualGrowth}</td>
                     <td>${data.previousGrowth}</td>    
                     <td>${data.actualGrowth > 0 ? 'UP' : 'DOWN'}</td>             
                 </tr>
                 <tr>
                  
                    <td>Inflation</td>
                    <td>${data.actualInflation}</td>
                     <td>${data.previousInflation}</td >      
                     <td>${data.actualInflation > 0 ? 'UP' : 'DOWN'}</td>                       
                 </tr>
            </tbody>
        </table>
    </body>
</html>
    `;
    return {html: html + cftc?.html, result}
}



    // app.get('/', async (req, res) => {
    //     const {html} = await getData()
    //     res.send("");
    // });

app.post('/', async (req, res) => {
    try {
        const { analysis } = await main();
        const signalString = req.body.body; // Assuming "body" is the key in your incoming request

        if (!signalString) {
            return res.status(400).send('Invalid signal format');
        }

        const signalArray = signalString.split(' ');

        // Assuming that signalArray is ["ticker:GBPJPY", "direction:buy", "tp:191.185", "sl:178.73"]
        const signal = signalArray.reduce((acc, item) => {
            const [key, value] = item.split(':');
            acc[key] = value;
            return acc;
        }, {});

        const baseCurrency = signal.ticker.substring(0, 3).toLowerCase(); // Extract base currency from the ticker

        const analysisDirection = analysis[baseCurrency];
        const signalDirection = signal.direction;

        if (analysisDirection && signalDirection && analysisDirection === signalDirection) {
            // Base currency direction matches the signal direction
            // Make an HTTP POST request to the desired URL
            const postData = {
                ticker: signal.ticker,
                direction: signal.direction,
                tp: signal.tp,
                sl: signal.sl
            };

            const textMessage = `
            Ticker: ${postData.ticker}
            Direction: ${postData.direction}
            Take Profit: ${postData.tp}
            Stop Loss: ${postData.sl}
            `;

            const apiUrl = `https://api.telegram.org/bot6226850331:AAF4t9Ch4_E9Vcu0BrchYV1qwb1x4dfqh9M/sendMessage?chat_id=@lmrnba_trading_channel&text=${encodeURIComponent(textMessage)}`;            await axios.post(apiUrl, postData);

            res.status(200).send('HTTP POST request sent.');
        } else {
            // Do nothing or respond with a different status/message if needed
            res.status(200).send('No action taken.');
        }
    } catch (error) {
        // Handle errors appropriately
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});



    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });


