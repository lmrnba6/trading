const axios = require('axios');
const yauzl = require('yauzl');
const xlsToJson = require('xls-to-json');
const fs = require('fs');
const path = require('path');
const {fredExcelUrl} = require("./constants");

async function downloadFile(url, destination) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
        });

        // Ensure the temp directory exists
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Save the zip file
        fs.writeFileSync(destination, Buffer.from(response.data));
        return tempDir;
    } catch (e) {
        console.log(e)
    }

}

async function downloadAndExtractXlsFromZip(url, destination) {
    const tempDir = await downloadFile(url, destination);

    return new Promise((resolve, reject) => {
        yauzl.open(destination, {lazyEntries: true}, (err, zipfile) => {
            if (err) {
                reject(err);
                return;
            }

            zipfile.readEntry();
            zipfile.on('entry', (entry) => {
                if (path.extname(entry.fileName) === '.xls') {
                    // Assuming there's only one XLS file in the zip archive
                    zipfile.openReadStream(entry, (err, readStream) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const outputPath = path.join(tempDir, entry.fileName);
                        const writeStream = fs.createWriteStream(outputPath);
                        readStream.pipe(writeStream);

                        writeStream.on('close', () => {
                            zipfile.readEntry();
                            resolve(outputPath);
                        });
                    });
                } else {
                    // Skip other entries
                    zipfile.readEntry();
                }
            });

            zipfile.on('end', () => {
                // If no XLS file is found, reject the promise
                reject(new Error('No XLS file found in the ZIP archive.'));
            });
        });
    });
}

async function readCftcFile(filePath) {
    return new Promise((resolve, reject) => {
        xlsToJson({
            input: filePath,
            output: null,
            sheet: null,
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                // Filter columns
                const filteredData = [];

                for (let index = 0; index < result.length; index++) {
                    const row = result[index];
                    const previousRow = index > 0 ? filteredData[index - 1] : null;

                    const PCT_NC = Number(row.Pct_of_OI_NonComm_Long_All - row.Pct_of_OI_NonComm_Short_All).toFixed(2);
                    const PCT_C = Number(row.Pct_of_OI_Comm_Long_All - row.Pct_of_OI_Comm_Short_All).toFixed(2);

                    filteredData.push({
                        Market_and_Exchange_Names: row.Market_and_Exchange_Names,
                        Report_Date_as_MM_DD_YYYY: row.Report_Date_as_MM_DD_YYYY,
                        NonComm_Positions_Long_All: row.NonComm_Positions_Long_All,
                        NonComm_Positions_Short_All: row.NonComm_Positions_Short_All,
                        Comm_Positions_Long_All: row.Comm_Positions_Long_All,
                        Comm_Positions_Short_All: row.Comm_Positions_Short_All,
                        Change_in_NonComm_Long_All: row.Change_in_NonComm_Long_All,
                        Change_in_NonComm_Short_All: row.Change_in_NonComm_Short_All,
                        Pct_of_OI_NonComm_Long_All: row.Pct_of_OI_NonComm_Long_All,
                        Pct_of_OI_NonComm_Short_All: row.Pct_of_OI_NonComm_Short_All,
                        Pct_of_OI_Comm_Long_All: row.Pct_of_OI_Comm_Long_All,
                        Pct_of_OI_Comm_Short_All: row.Pct_of_OI_Comm_Short_All,
                        PCT_NC: Number(PCT_NC).toFixed(2),
                        PCT_C: Number(PCT_C).toFixed(2),
                        Bias_NC: previousRow && previousRow.PCT_NC < PCT_NC ? 'LONG' : 'SHORT',
                        Bias_C: previousRow && previousRow.PCT_C < PCT_C ? 'LONG' : 'SHORT',
                        Long_Bias: Number(PCT_C) > 0 ? 'LONG' : 'SHORT',
                    });
                }

                // Sort by date in ascending order
                filteredData.sort((a, b) => {
                    const nameComparison = a.Market_and_Exchange_Names.localeCompare(b.Market_and_Exchange_Names);
                    if (nameComparison !== 0) {
                        return nameComparison;
                    }
                    const dateA = new Date(a.Report_Date_as_MM_DD_YYYY);
                    const dateB = new Date(b.Report_Date_as_MM_DD_YYYY);
                    return dateA - dateB;
                });

                resolve(filteredData);
            }
        });
    });
}

async function readFredFile(code, period) {
    const url = fredExcelUrl(code, period)
    const destination = path.join(__dirname, 'temp', code + '.xls');
    await downloadFile(url, destination)
    return new Promise((resolve, reject) => {
        xlsToJson({
            input: destination,
            output: null,
            sheet: null,
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                // Filter columns
                const filteredData = [];

                for (let index = 0; index < result.length; index++) {
                    const row = result[index];

                    filteredData.push({
                        date: row['FRED Graph Observations'],
                        value: row[''],
                    });
                }

                // Sort by date in ascending order
                filteredData.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });

                resolve(filteredData.slice(0, 24));
            }
        });
    });
}


async function main() {
    const zipFileUrl = 'https://www.cftc.gov/files/dea/history/dea_fut_xls_2023.zip';
    const destinationZipFile = path.join(__dirname, 'temp', 'dea_fut_xls_2023.zip');

    try {
        const xlsFilePath = await downloadAndExtractXlsFromZip(zipFileUrl, destinationZipFile);
        console.log('XLS file extracted successfully:', xlsFilePath);

        const extractedData = await readCftcFile(xlsFilePath);

        // Separate data based on Market_and_Exchange_Names
        const keywordLists = {
            'chf': [],
            'eur': [],
            'jpy': [],
            'gbp': [],
            'aud': [],
            'cad': [],
            'nzd': [],
        };

        extractedData.forEach(entry => {
            const marketNames = entry.Market_and_Exchange_Names.toLowerCase();
            if (marketNames.includes("swiss franc")) {
                keywordLists['chf'].push(entry);
            } else if (marketNames.includes("euro short term rate")) {
                keywordLists['eur'].push(entry);
            } else if (marketNames.includes("japanese yen")) {
                keywordLists['jpy'].push(entry);
            } else if (marketNames.includes("british pound - chicago")) {
                keywordLists['gbp'].push(entry);
            } else if (marketNames.includes("australian dollar")) {
                keywordLists['aud'].push(entry);
            } else if (marketNames.includes("canadian dollar")) {
                keywordLists['cad'].push(entry);
            } else if (marketNames.includes("nz dollar")) {
                keywordLists['nzd'].push(entry);
            }
        });

        const data = {}
        for (const keyword in keywordLists) {
            keywordLists[keyword] = keywordLists[keyword].slice(-4);
        }

        Object.keys(keywordLists).forEach(k => {
            data[k] = keywordLists[k][0].Bias_NC === 'LONG' &&  keywordLists[k][0].Bias_C === 'LONG' ? 'LONG' : keywordLists[k][0].Bias_NC === 'SHORT' &&  keywordLists[k][0].Bias_C === 'SHORT' ? 'SHORT' : keywordLists[k][0].Long_Bias
        })

        // Merge the lists at the end
        const mergedData = Object.values(keywordLists).flat();


        return {html: generateHtmlTable(mergedData), data};
    } catch (error) {
        console.error('Error:', error.message);
    }
}




function generateHtmlTable(data) {
    const tableHeader = `
        <thead>
            <tr>
                <th>Market and Exchange Names</th>
                <th>Report Date</th>
                <th>NonComm Positions Long All</th>
                <th>NonComm Positions Short All</th>
                <th>Comm Positions Long All</th>
                <th>Comm Positions Short All</th>
                <th>PCT_NC</th>
                <th>PCT_C</th>
<!--                <th>Bias_NC</th>-->
<!--                <th>Bias_C</th>-->
<!--                <th>Long_Bias</th>-->
                <th>Result</th>
            </tr>
        </thead>
    `;

    const tableRows = data.map(row => {
        const backgroundColorNC = row.Bias_NC === 'LONG' ? 'lightgreen' : 'lightcoral';
        const backgroundColorC = row.Bias_C === 'LONG' ? 'lightgreen' : 'lightcoral';
        const backgroundColorLongBias = row.Long_Bias === 'LONG' ? 'lightgreen' : 'lightcoral';
        const dir = row.Bias_NC === 'LONG' &&  row.Bias_C === 'LONG' ? 'LONG' : row.Bias_NC === 'SHORT' &&  row.Bias_C === 'SHORT' ? 'SHORT' : row.Long_Bias
        const backgroundColorResult = dir === 'LONG' ? 'lightgreen' : dir === 'SHORT' ? 'lightcoral' : 'white';

        return `
            <tr>
                <td>${row.Market_and_Exchange_Names}</td>
                <td>${row.Report_Date_as_MM_DD_YYYY}</td>
                <td>${row.NonComm_Positions_Long_All}</td>
                <td>${row.NonComm_Positions_Short_All}</td>
                <td>${row.Comm_Positions_Long_All}</td>
                <td>${row.Comm_Positions_Short_All}</td>
                <td>${row.PCT_NC}</td>
                <td>${row.PCT_C}</td>
                <!--<td style="background-color: ${backgroundColorNC}">${row.Bias_NC}</td>
                <td style="background-color: ${backgroundColorC}">${row.Bias_C}</td>
                <td style="background-color: ${backgroundColorLongBias}">${row.Long_Bias}</td>-->
                <td style="background-color: ${backgroundColorResult}">${dir}</td>
            </tr>
        `;
    });

    const table = `
        <table border="1">
            ${tableHeader}
            <tbody>
                ${tableRows.join('')}
            </tbody>
        </table>
    `;

    return table;
}

module.exports = {main, readFredFile};
