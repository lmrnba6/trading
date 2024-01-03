const {
    calculateNfpRating, calculateIjcRating, calculateCpiRating, calculateCcpiRating, calculatePpiRating,
    calculateCppiRating, calculateCpeRating, calculateCcpeRating, calculateBuildingPermitRating, calculateUmsciRating,
    calculateIpRating, calculateGdpRating, calculateBopRating, calculateRetailRating, calculateUs10YRating,
    calculateGovGdpRating, calculateDeficitSurplusRating, calculateInterestBillRating, calculateLiquidityCoverRating,
    calculateM2Rating, calculateFedRating, calculateWalclRating
} = require("./rating");
const {
    NFP_CODE,
    IJC_CODE,
    CPI_CODE,
    CCPI_CODE,
    PPI_CODE,
    CPPI_CODE,
    CPE_CODE,
    CCPE_CODE,
    BP_CODE, UMCSI_CODE, IP_CODE, GDP_CODE, BOP_CODE, HOUSING_CODE, RETAIL_CODE, US10Y_CODE, GDP_GNP_CODE,
    DEFICIT_SURPLUS_CODE, INTEREST_BILL_CODE, FEDERAL_RECEIPT, M2_CODE, DFF_CODE, WALCL_CODE
} = require("./constants");
const Fred = require("fred-api");
const {readFredFile} = require("./cftc");
apiKey = 'f265afb10c9ab554fe89293f0d915455';
fred = new Fred(apiKey);

function calculateYoy(type, observations) {
    const yoyResults = [];
    const dataDict = {};
    observations.forEach(observation => {
        if (Number(observation.value)) {
            dataDict[observation.date] = parseFloat(observation.value);
        }
    });

    observations.forEach((observation) => {
        const currentDate = observation.date;
        const currentYear = parseInt(currentDate.split('-')[0]);
        const monthAndDay = currentDate.substring(5);

        const previousYearDate = `${currentYear - 1}-${monthAndDay}`;

        // Check if data exists for the previous year's same month
        if (dataDict[previousYearDate] && dataDict[currentDate]) {
            const currentVal = parseFloat(observation.value);
            const prevYoyVal = dataDict[previousYearDate];
            const yoy = (currentVal - prevYoyVal) / Math.abs(prevYoyVal);

            let rate;
            if (type === NFP_CODE) {
                rate = calculateNfpRating(yoy);
            } else if (type === IJC_CODE) {
                rate = calculateIjcRating(yoy)
            } else if (type === CPI_CODE) {
                rate = calculateCpiRating(yoy)
            } else if (type === CCPI_CODE) {
                rate = calculateCcpiRating(yoy)
            } else if (type === PPI_CODE) {
                rate = calculatePpiRating(yoy)
            } else if (type === CPPI_CODE) {
                rate = calculateCppiRating(yoy)
            } else if (type === CPE_CODE) {
                rate = calculateCpeRating(yoy)
            } else if (type === CCPE_CODE) {
                rate = calculateCcpeRating(yoy)
            } else if (type === BP_CODE) {
                rate = calculateBuildingPermitRating(currentVal)
            } else if (type === UMCSI_CODE) {
                rate = calculateUmsciRating(currentVal)
            } else if (type === IP_CODE) {
                rate = calculateIpRating(yoy)
            } else if (type === GDP_CODE) {
                rate = calculateGdpRating(yoy)
            } else if (type === BOP_CODE) {
                rate = calculateBopRating(currentVal/100)
            } else if (type === HOUSING_CODE) {
                rate = calculateBuildingPermitRating(currentVal)
            } else if (type === RETAIL_CODE) {
                rate = calculateRetailRating(yoy)
            } else if (type === US10Y_CODE) {
                rate = calculateUs10YRating(currentVal/100)
            } else if (type === GDP_GNP_CODE) {
                rate = calculateGovGdpRating(currentVal)
            } else if (type === M2_CODE) {
                rate = calculateM2Rating(yoy)
            } else if (type === DFF_CODE) {
                rate = calculateFedRating(currentVal)
            } else if (type === WALCL_CODE) {
                rate = calculateWalclRating(currentVal)
            }
            yoyResults.push({
                date: currentDate,
                value: Number(currentVal).toFixed(2),
                yoy: `${(yoy * 100).toFixed(2)}%`,
                rate: rate
            });
        }
    });

    return yoyResults;
}

async function calculateGDPBTN() {
    return new Promise(async (resolve, reject) => {
        try {
            const data1 = await readFredFile('GDP', 'Quarterly');
            const data2 = await readFredFile('GFDEBTN', 'Quarterly');

            // Filter out objects with non-numeric values
            const filteredData1 = data1.filter(item => item.value && !isNaN(Number(item.value)));
            const filteredData2 = data2.filter(item => item.value && !isNaN(Number(item.value)));

            // Sort filteredData1 and filteredData2 by date in ascending order
            filteredData1.sort((a, b) => new Date(a.date) - new Date(b.date));
            filteredData2.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Extract unique dates from both lists
            const dates1 = new Set(filteredData1.map(item => item.date));
            const dates2 = new Set(filteredData2.map(item => item.date));

            // Find common dates
            const commonDates = Array.from(new Set([...dates1].filter(date => dates2.has(date))));

            // Filter data1 and data2 to keep only objects with common dates
            const commonData1 = filteredData1.filter(item => commonDates.includes(item.date));
            const commonData2 = filteredData2.filter(item => commonDates.includes(item.date));

            // Create a map of data2 values based on date
            const data2Map = new Map(commonData2.map(item => [item.date, item.value]));

            // Calculate data3
            const data3 = commonData1.map(item => {
                const value2 = data2Map.get(item.date);
                if (value2) {
                    return {
                        date: item.date,
                        value: Number(value2) / Number(item.value),
                    };
                }
                return null;
            }).filter(item => item !== null);

            // Calculate data4
            const data4 = data3.map((item, index) => {
                if (index === 0) {
                    return { date: item.date, value: 0 }; // because we don't have a previous value
                }
                return {
                    date: item.date,
                    value: (data3[index].value - data3[index - 1].value) / data3[index - 1].value,
                };
            });

            // Calculate data5
            const data5 = data4.map((item, index) => {
                if (index < 3) {
                    return { date: item.date, value: 0 }; // because we don't have 4 previous values
                }
                const average = (data4[index].value + data4[index - 1].value + data4[index - 2].value + data4[index - 3].value) / 4;
                return {
                    date: item.date,
                    value: average,
                };
            });

            // Calculate final data
            const finalData = data5.map((item, index) => ({
                date: item.date,
                value: Number(item.value * 100).toFixed(2),
                rate: calculateGovGdpRating(item.value),
            }));

            // Sort finalData by date in descending order
            finalData.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Extract required information
            const result = {
                date: finalData[0].date,
                actualRate: finalData[0].rate,
                previousRate: finalData[1].rate,
                actualPercentage: finalData[0].value + '%',
                previousPercentage: finalData[1].value + '%',
            };

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}




async function calculateDeficitSurplus() {
    return new Promise(async (resolve, reject) => {
        const result = await readFredFile('FYFSGDA188S', 'Annual')
        const filteredData = result.filter(item => item.value && !isNaN(Number(item.value)));
        const data = [];
        filteredData.forEach(a => {
            const rate = calculateDeficitSurplusRating(a.value/100);
            data.push({
                date: a.date,
                value: Number(a.value).toFixed(2),
                rate: rate
            });
        });
        resolve({
            date: data[0].date,
            actualRate: data[0].rate,
            previousRate: data[1].rate,
            actualPercentage: data[0].value + '%',
            previousPercentage: data[1].value + '%',
        });
    });
}

async function calculateInterestBill() {
    return new Promise(async (resolve, reject) => {
        try {
            const data1 = await readFredFile(GDP_GNP_CODE, 'Annual');
            const data2 = await readFredFile(INTEREST_BILL_CODE, 'Annual, Fiscal Year');

            // Filter out objects with non-numeric values
            const filteredData1 = data1.filter(item => item.value && !isNaN(Number(item.value)));
            const filteredData2 = data2.filter(item => item.value && !isNaN(Number(item.value)));

            // Extract unique years from both lists
            const years1 = new Set(filteredData1.map(item => new Date(item.date).getFullYear()));
            const years2 = new Set(filteredData2.map(item => new Date(item.date).getFullYear()));

            // Find common years
            const commonYears = Array.from(new Set([...years1].filter(year => years2.has(year))));

            // Filter data1 and data2 to keep only objects with common years and non-NaN values
            const commonData1 = filteredData1.filter(item => commonYears.includes(new Date(item.date).getUTCFullYear()));
            const commonData2 = filteredData2.filter(item => commonYears.includes(new Date(item.date).getUTCFullYear()));

            // Calculate data3
            const data = commonData2.map((item, index) => {
                const value = Number(item.value) / Number(commonData1[index].value*1000)
                return {
                    date: new Date(item.date).getUTCFullYear(),
                    value,
                    rate: calculateInterestBillRating(value)
                };
            });

            // Extract required information
            const result = {
                date: data[0].date,
                actualRate: data[0].rate,
                previousRate: data[1].rate,
                actualPercentage: (data[0].value * 100).toFixed(2) + '%',
                previousPercentage: (data[1].value * 100).toFixed(2) + '%',
            };

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

async function calculateLiquidityCover() {
    return new Promise(async (resolve, reject) => {
        try {
            const data1 = await readFredFile(FEDERAL_RECEIPT, 'Annual, Fiscal Year');
            const data2 = await readFredFile(INTEREST_BILL_CODE, 'Annual, Fiscal Year');

            // Filter out objects with non-numeric values
            const filteredData1 = data1.filter(item => item.value && !isNaN(Number(item.value)));
            const filteredData2 = data2.filter(item => item.value && !isNaN(Number(item.value)));

            // Extract unique years from both lists
            const years1 = new Set(filteredData1.map(item => new Date(item.date).getFullYear()));
            const years2 = new Set(filteredData2.map(item => new Date(item.date).getFullYear()));

            // Find common years
            const commonYears = Array.from(new Set([...years1].filter(year => years2.has(year))));

            // Filter data1 and data2 to keep only objects with common years and non-NaN values
            const commonData1 = filteredData1.filter(item => commonYears.includes(new Date(item.date).getUTCFullYear()));
            const commonData2 = filteredData2.filter(item => commonYears.includes(new Date(item.date).getUTCFullYear()));

            // Calculate data3
            const data = commonData1.map((item, index) => {
                const value = Number(item.value) / Number(commonData2[index].value)
                return {
                    date: new Date(item.date).getUTCFullYear(),
                    value,
                    rate: calculateLiquidityCoverRating(value)
                };
            });

            // Extract required information
            const result = {
                date: data[0].date,
                actualRate: data[0].rate,
                previousRate: data[1].rate,
                actual: (data[0].value).toFixed(2),
                previous: (data[1].value).toFixed(2),
            };

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}





async function calculateApi(type) {
    return new Promise(async (resolve, reject) => {
        const result = await readFredFile(type, type === GDP_CODE || type === BOP_CODE ? 'Quarterly' : 'Monthly')
        const list = result.filter(item => item.value && !isNaN(Number(item.value)));

        const data = calculateYoy(type, list);
        resolve({
            date: data[0] ? data[0].date : 0,
            actual: data[0] ? data[0].value : 0,
            previous: data[1] ? data[1].value : 0,
            actualPercentage: data[0] ? data[0].yoy : 0,
            previousPercentage:data[1] ? data[1].yoy : 0,
            actualRate: data[0] ?  data[0].rate : 0,
            previousRate: data[1] ? data[1].rate : 0,
        });

    });
}

async function executeApi() {
    try {
        const data = await Promise.all([
            calculateApi(NFP_CODE),
            calculateApi(IJC_CODE),
            calculateApi(CPI_CODE),
            calculateApi(CCPI_CODE),
            calculateApi(PPI_CODE),
            calculateApi(CPPI_CODE),
            calculateApi(CPE_CODE),
            calculateApi(CCPE_CODE),
            calculateApi(BP_CODE),
            calculateApi(UMCSI_CODE),
            calculateApi(IP_CODE),
            calculateApi(GDP_CODE),
            calculateApi(BOP_CODE),
            calculateApi(HOUSING_CODE),
            calculateApi(RETAIL_CODE),
            calculateGDPBTN(),
            calculateDeficitSurplus(),
            calculateApi(US10Y_CODE),
            calculateInterestBill(),
            calculateLiquidityCover(),
            calculateApi(M2_CODE),
            calculateApi(DFF_CODE),
            calculateApi(WALCL_CODE)
        ])
        return {
            nfp: data[0],
            ijc: data[1],
            cpi: data[2],
            ccpi: data[3],
            ppi: data[4],
            cppi: data[5],
            cpe: data[6],
            ccpe: data[7],
            bp: data[8],
            umcsi: data[9],
            ip: data[10],
            gdp: data[11],
            bop: data[12],
            housing: data[13],
            retail: data[14],
            gdpgnp: data[15],
            deficit: data[16],
            us10: data[17],
            interest: data[18],
            liquidity: data[19],
            m2: data[20],
            dff: data[21],
            walcl: data[22]
        }
    } catch (e) {
        console.log(e)
        return {}
    }
}


module.exports = {executeApi}

