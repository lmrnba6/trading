function getRating(value, thresholds) {
    // Sort the thresholds by their value in descending order.
    thresholds.sort((a, b) => b.value - a.value);

    // If the value is greater than or equal to the highest threshold, return the rating for the highest threshold.
    if (value >= thresholds[0].value) {
        return thresholds[0].rating;
    }

    // If the value is less than or equal to the lowest threshold, return the rating for the lowest threshold.
    if (value <= thresholds[thresholds.length - 1].value) {
        return thresholds[thresholds.length - 1].rating;
    }

    // Iterate through the sorted thresholds to find the appropriate range and return the corresponding rating.
    for (let i = 0; i < thresholds.length - 1; i++) {
        if (value < thresholds[i].value && value >= thresholds[i + 1].value) {
            return thresholds[i + 1].rating;
        }
    }

    // Default return if somehow none of the conditions are met (this shouldn't normally be hit).
    return thresholds[thresholds.length - 1].rating;
}



const PMI_THRESHOLDS = [
    { rating: 10, value: 60 },
    { rating: 9, value: 59 },
    { rating: 8, value: 58 },
    { rating: 7, value: 57 },
    { rating: 6, value: 56 },
    { rating: 5, value: 55 },
    { rating: 4, value: 54 },
    { rating: 3, value: 53 },
    { rating: 2, value: 52 },
    { rating: 1, value: 51 },
    { rating: 0, value: 50 },
    { rating: -1, value: 49 },
    { rating: -2, value: 48 },
    { rating: -3, value: 47 },
    { rating: -4, value: 46 },
    { rating: -5, value: 45 },
    { rating: -6, value: 44 },
    { rating: -7, value: 43 },
    { rating: -8, value: 42 },
    { rating: -9, value: 41 },
    { rating: -10, value: 40 }  // Added this entry to complete the thresholds.
];
const UMSCI_THRESHOLDS = [
    { rating: 10, value: 100 },
    { rating: 9, value: 98 },
    { rating: 8, value: 96 },
    { rating: 7, value: 94 },
    { rating: 6, value: 92 },
    { rating: 5, value: 90 },
    { rating: 4, value: 88 },
    { rating: 3, value: 86 },
    { rating: 2, value: 84 },
    { rating: 1, value: 82 },
    { rating: 0, value: 80 },
    { rating: -1, value: 78 },
    { rating: -2, value: 76 },
    { rating: -3, value: 74 },
    { rating: -4, value: 72 },
    { rating: -5, value: 70 },
    { rating: -6, value: 68 },
    { rating: -7, value: 66 },
    { rating: -8, value: 64 },
    { rating: -9, value: 62 },
    { rating: -10, value: 60 }
];
const BUILDING_PERMIT_THRESHOLDS = [
    { rating: 10, value: 2200 },
    { rating: 9, value: 2100 },
    { rating: 8, value: 2000 },
    { rating: 7, value: 1900 },
    { rating: 6, value: 1800 },
    { rating: 5, value: 1700 },
    { rating: 4, value: 1600 },
    { rating: 3, value: 1500 },
    { rating: 2, value: 1400 },
    { rating: 1, value: 1300 },
    { rating: 0, value: 1200 },
    { rating: -1, value: 1150 },
    { rating: -2, value: 1100 },
    { rating: -3, value: 1050 },
    { rating: -4, value: 1000 },
    { rating: -5, value: 950 },
    { rating: -6, value: 900 },
    { rating: -7, value: 850 },
    { rating: -8, value: 800 },
    { rating: -9, value: 750 },
    { rating: -10, value: 700 }
];
const NFP_THRESHOLDS = [
    { rating: 10, value: 0.05 },
    { rating: 9, value: 0.045 },
    { rating: 8, value: 0.04 },
    { rating: 6, value: 0.035 },  // Notice the jump from 8 to 6 in the rating.
    { rating: 5, value: 0.03 },
    { rating: 4, value: 0.025 },
    { rating: 2, value: 0.02 },  // Another jump from 4 to 2 in the rating.
    { rating: 1, value: 0.015 },
    { rating: 0, value: 0.01 },
    { rating: -1, value: 0.005 },
    { rating: -2, value: 0 },
    { rating: -4, value: -0.005 },  // Jump from -2 to -4 in the rating.
    { rating: -5, value: -0.01 },
    { rating: -6, value: -0.015 },
    { rating: -8, value: -0.02 },  // Jump from -6 to -8 in the rating.
    { rating: -9, value: -0.025 },
    { rating: -10, value: -0.03 }
];
const IJC_THRESHOLDS = [
    { rating: 10, value: -0.25 },
    { rating: 9, value: -0.225 },
    { rating: 8, value: -0.2 },
    { rating: 7, value: -0.175 },
    { rating: 6, value: -0.15 },
    { rating: 5, value: -0.125 },
    { rating: 4, value: -0.1 },
    { rating: 3, value: -0.075 },
    { rating: 2, value: -0.05 },
    { rating: 1, value: -0.025 },
    { rating: 0, value: 0 },
    { rating: -1, value: 0.025 },
    { rating: -2, value: 0.05 },
    { rating: -3, value: 0.075 },
    { rating: -4, value: 0.1 },
    { rating: -5, value: 0.125 },
    { rating: -6, value: 0.15 },
    { rating: -7, value: 0.175 },
    { rating: -8, value: 0.2 },
    { rating: -9, value: 0.225 },
    { rating: -10, value: 0.25 }
];

const CPI_THRESHOLDS = [
    { rating: 10, value: 0.06 },
    { rating: 9, value: 0.055 },
    { rating: 8, value: 0.05 },
    { rating: 7, value: 0.045 },
    { rating: 6, value: 0.04 },
    { rating: 5, value: 0.035 },
    { rating: 4, value: 0.03 },
    { rating: 3, value: 0.025 },
    { rating: 2, value: 0.02 },
    { rating: 1, value: 0.015 },
    { rating: 0, value: 0.01 },
    { rating: -1, value: 0.0075 },
    { rating: -2, value: 0.005 },
    { rating: -3, value: 0.0025 },
    { rating: -4, value: 0 },
    { rating: -5, value: -0.0025 },
    { rating: -6, value: -0.005 },
    { rating: -7, value: -0.0075 },
    { rating: -8, value: -0.01 },
    { rating: -9, value: -0.0125 },
    { rating: -10, value: -0.015 }
];

const CCPI_THRESHOLDS = [
    { rating: 10, value: 0.06 },
    { rating: 9, value: 0.05 },
    { rating: 8, value: 0.045 },
    { rating: 7, value: 0.04 },
    { rating: 6, value: 0.035 },
    { rating: 5, value: 0.0325 },
    { rating: 4, value: 0.03 },
    { rating: 3, value: 0.0275 },
    { rating: 2, value: 0.025 },
    { rating: 1, value: 0.0225 },
    { rating: 0, value: 0.02 },
    { rating: -1, value: 0.019 },
    { rating: -2, value: 0.018 },
    { rating: -3, value: 0.017 },
    { rating: -4, value: 0.016 },
    { rating: -5, value: 0.014 },
    { rating: -6, value: 0.013 },
    { rating: -7, value: 0.012 },
    { rating: -8, value: 0.01 },
    { rating: -9, value: 0.008 },
    { rating: -10, value: 0.006 }
];

const PPI_THRESHOLDS = [
    { rating: 10, value: 0.07 },
    { rating: 9, value: 0.065 },
    { rating: 8, value: 0.06 },
    { rating: 7, value: 0.055 },
    { rating: 6, value: 0.05 },
    { rating: 5, value: 0.045 },
    { rating: 4, value: 0.04 },
    { rating: 3, value: 0.035 },
    { rating: 2, value: 0.03 },
    { rating: 1, value: 0.025 },
    { rating: 0, value: 0.02 },
    { rating: -1, value: 0.015 },
    { rating: -2, value: 0.01 },
    { rating: -3, value: 0.005 },
    { rating: -4, value: 0 },
    { rating: -5, value: -0.005 },
    { rating: -6, value: -0.01 },
    { rating: -7, value: -0.015 },
    { rating: -8, value: -0.02 },
    { rating: -9, value: -0.025 },
    { rating: -10, value: -0.03 }
];

const CPPI_THRESHOLDS = [
    { rating: 10, value: 0.04 },
    { rating: 9, value: 0.038 },
    { rating: 8, value: 0.036 },
    { rating: 7, value: 0.034 },
    { rating: 6, value: 0.032 },
    { rating: 5, value: 0.03 },
    { rating: 4, value: 0.028 },
    { rating: 3, value: 0.026 },
    { rating: 2, value: 0.024 },
    { rating: 1, value: 0.022 },
    { rating: 0, value: 0.02 },
    { rating: -1, value: 0.018 },
    { rating: -2, value: 0.016 },
    { rating: -3, value: 0.014 },
    { rating: -4, value: 0.012 },
    { rating: -5, value: 0.01 },
    { rating: -6, value: 0.008 },
    { rating: -7, value: 0.006 },
    { rating: -8, value: 0.004 },
    { rating: -9, value: 0.002 },
    { rating: -10, value: 0 }
];

const CPE_THRESHOLDS = [
    { rating: 10, value: 0.045 },
    { rating: 9, value: 0.04 },
    { rating: 8, value: 0.0375 },
    { rating: 7, value: 0.035 },
    { rating: 6, value: 0.0325 },
    { rating: 5, value: 0.03 },
    { rating: 4, value: 0.028 },
    { rating: 3, value: 0.026 },
    { rating: 2, value: 0.024 },
    { rating: 1, value: 0.022 },
    { rating: 0, value: 0.02 },
    { rating: -1, value: 0.019 },
    { rating: -2, value: 0.018 },
    { rating: -3, value: 0.016 },
    { rating: -4, value: 0.014 },
    { rating: -5, value: 0.012 },
    { rating: -6, value: 0.01 },
    { rating: -7, value: 0.008 },
    { rating: -8, value: 0.006 },
    { rating: -9, value: 0.004 },
    { rating: -10, value: 0.0025 }
];
const CCPE_THRESHOLDS = [
    { rating: 10, value: 0.04 },
    { rating: 9, value: 0.038 },
    { rating: 8, value: 0.036 },
    { rating: 7, value: 0.034 },
    { rating: 6, value: 0.032 },
    { rating: 5, value: 0.03 },
    { rating: 4, value: 0.028 },
    { rating: 3, value: 0.026 },
    { rating: 2, value: 0.024 },
    { rating: 1, value: 0.022 },
    { rating: 0, value: 0.02 },
    { rating: -1, value: 0.019 },
    { rating: -2, value: 0.018 },
    { rating: -3, value: 0.017 },
    { rating: -4, value: 0.016 },
    { rating: -5, value: 0.015 },
    { rating: -6, value: 0.014 },
    { rating: -7, value: 0.013 },
    { rating: -8, value: 0.012 },
    { rating: -9, value: 0.011 },
    { rating: -10, value: 0.01 }
];

const IP_THRESHOLDS = [
    { rating: 10, value: 0.07 },
    { rating: 9, value: 0.06 },
    { rating: 8, value: 0.05 },
    { rating: 7, value: 0.045 },
    { rating: 6, value: 0.04 },
    { rating: 5, value: 0.035 },
    { rating: 4, value: 0.03 },
    { rating: 3, value: 0.025 },
    { rating: 2, value: 0.02 },
    { rating: 1, value: 0.015 },
    { rating: 0, value: 0.01 },
    { rating: -1, value: 0.005 },
    { rating: -2, value: 0 },
    { rating: -3, value: -0.005 },
    { rating: -4, value: -0.01 },
    { rating: -5, value: -0.015 },
    { rating: -6, value: -0.02 },
    { rating: -7, value: -0.025 },
    { rating: -8, value: -0.03 },
    { rating: -9, value: -0.035 },
    { rating: -10, value: -0.04 }
];

const GDP_THRESHOLDS = [
    { rating: 10, value: 0.05 },
    { rating: 9, value: 0.045 },
    { rating: 8, value: 0.04 },
    { rating: 7, value: 0.0375 },
    { rating: 6, value: 0.035 },
    { rating: 5, value: 0.0325 },
    { rating: 4, value: 0.03 },
    { rating: 3, value: 0.0275 },
    { rating: 2, value: 0.025 },
    { rating: 1, value: 0.0225 },
    { rating: 0, value: 0.02 },
    { rating: -1, value: 0.0175 },
    { rating: -2, value: 0.015 },
    { rating: -3, value: 0.0125 },
    { rating: -4, value: 0.01 },
    { rating: -5, value: 0.0075 },
    { rating: -6, value: 0.005 },
    { rating: -7, value: 0.0025 },
    { rating: -8, value: 0 },
    { rating: -9, value: -0.0025 },
    { rating: -10, value: -0.005 }
];

const BOP_THRESHOLDS = [
    { rating: 10, value: 0.00 },
    { rating: 9, value: -0.0025 },
    { rating: 8, value: -0.005 },
    { rating: 7, value: -0.0075 },
    { rating: 6, value: -0.01 },
    { rating: 5, value: -0.0125 },
    { rating: 4, value: -0.015 },
    { rating: 3, value: -0.0175 },
    { rating: 2, value: -0.02 },
    { rating: 1, value: -0.0225 },
    { rating: 0, value: -0.025 },
    { rating: -1, value: -0.0275 },
    { rating: -2, value: -0.03 },
    { rating: -3, value: -0.0325 },
    { rating: -4, value: -0.035 },
    { rating: -5, value: -0.0375 },
    { rating: -6, value: -0.04 },
    { rating: -7, value: -0.0425 },
    { rating: -8, value: -0.045 },
    { rating: -9, value: -0.0475 },
    { rating: -10, value: -0.05 }
];

const RETAIL_THRESHOLDS = [
    { rating: 10, value: 0.06 },
    { rating: 9, value: 0.055 },
    { rating: 8, value: 0.05 },
    { rating: 7, value: 0.045 },
    { rating: 6, value: 0.04 },
    { rating: 5, value: 0.035 },
    { rating: 4, value: 0.03 },
    { rating: 3, value: 0.025 },
    { rating: 2, value: 0.02 },
    { rating: 1, value: 0.015 },
    { rating: 0, value: 0.01 },
    { rating: -1, value: 0.005 },
    { rating: -2, value: 0.00 },
    { rating: -3, value: -0.005 },
    { rating: -4, value: -0.01 },
    { rating: -5, value: -0.015 },
    { rating: -6, value: -0.02 },
    { rating: -7, value: -0.025 },
    { rating: -8, value: -0.03 },
    { rating: -9, value: -0.035 },
    { rating: -10, value: -0.04 }
];

const US_10_Y_THRESHOLDS = [
    { rating: -10, value: 0.10 },
    { rating: -9, value: 0.095 },
    { rating: -8, value: 0.09 },
    { rating: -7, value: 0.085 },
    { rating: -6, value: 0.08 },
    { rating: -5, value: 0.075 },
    { rating: -4, value: 0.07 },
    { rating: -3, value: 0.065 },
    { rating: -2, value: 0.06 },
    { rating: -1, value: 0.055 },
    { rating: 0, value: 0.05 },
    { rating: 1, value: 0.045 },
    { rating: 2, value: 0.04 },
    { rating: 3, value: 0.035 },
    { rating: 4, value: 0.03 },
    { rating: 5, value: 0.025 },
    { rating: 6, value: 0.02 },
    { rating: 7, value: 0.015 },
    { rating: 8, value: 0.01 },
    { rating: 9, value: 0.005 },
    { rating: 10, value: 0.00 }
];

const GOV_GDP_THRESHOLDS = [
    { rating: -10, value: -0.02 },
    { rating: -9, value: -0.018 },
    { rating: -8, value: -0.016 },
    { rating: -7, value: -0.014 },
    { rating: -6, value: -0.012 },
    { rating: -5, value: -0.01 },
    { rating: -4, value: -0.008 },
    { rating: -3, value: -0.006 },
    { rating: -2, value: -0.004 },
    { rating: -1, value: -0.002 },
    { rating: 0, value: 0.00 },
    { rating: 1, value: 0.002 },
    { rating: 2, value: 0.004 },
    { rating: 3, value: 0.006 },
    { rating: 4, value: 0.008 },
    { rating: 5, value: 0.01 },
    { rating: 6, value: 0.012 },
    { rating: 7, value: 0.014 },
    { rating: 8, value: 0.016 },
    { rating: 9, value: 0.018 },
    { rating: 10, value: 0.02 }
];

const DEFICIT_SURPLUS_THRESHOLDS = [
    { rating: -10, value: 0.10 },
    { rating: -9, value: 0.09 },
    { rating: -8, value: 0.08 },
    { rating: -7, value: 0.07 },
    { rating: -6, value: 0.06 },
    { rating: -5, value: 0.05 },
    { rating: -4, value: 0.04 },
    { rating: -3, value: 0.03 },
    { rating: -2, value: 0.02 },
    { rating: -1, value: 0.01 },
    { rating: 0, value: 0.00 },
    { rating: 1, value: -0.01 },
    { rating: 2, value: -0.02 },
    { rating: 3, value: -0.03 },
    { rating: 4, value: -0.04 },
    { rating: 5, value: -0.05 },
    { rating: 6, value: -0.06 },
    { rating: 7, value: -0.07 },
    { rating: 8, value: -0.08 },
    { rating: 9, value: -0.09 },
    { rating: 10, value: -0.10 }
];

const INTEREST_BILL_THRESHOLDS = [
    { rating: -10, value: 0.025 },
    { rating: -9, value: 0.0225 },
    { rating: -8, value: 0.02 },
    { rating: -7, value: 0.0175 },
    { rating: -6, value: 0.015 },
    { rating: -5, value: 0.0125 },
    { rating: -4, value: 0.01 },
    { rating: -3, value: 0.0075 },
    { rating: -2, value: 0.005 },
    { rating: -1, value: 0.0025 },
    { rating: 0, value: 0.00 }
];

const LIQUIDITY_COVER_THRESHOLDS = [
    { rating: 10, value: 15 },
    { rating: 8, value: 14 },
    { rating: 6, value: 13 },
    { rating: 4, value: 12 },
    { rating: 2, value: 11 },
    { rating: 0, value: 10 },
    { rating: -1, value: 9 },
    { rating: -2, value: 8 },
    { rating: -3, value: 7 },
    { rating: -4, value: 6 },
    { rating: -6, value: 5 },
    { rating: -8, value: 4 },
    { rating: -10, value: 3 }
];

const M2_THRESHOLDS = [
    { value: 10.0, rating: 10 },
    { value: 9.5, rating: 9 },
    { value: 9.0, rating: 8 },
    { value: 8.5, rating: 7 },
    { value: 8.0, rating: 6 },
    { value: 7.5, rating: 5 },
    { value: 7.0, rating: 4 },
    { value: 6.5, rating: 3 },
    { value: 6.0, rating: 2 },
    { value: 5.5, rating: 1 },
    { value: 5.0, rating: 0 },
    { value: 4.5, rating: -1 },
    { value: 4.0, rating: -2 },
    { value: 3.5, rating: -3 },
    { value: 3.0, rating: -4 },
    { value: 2.5, rating: -5 },
    { value: 2.0, rating: -6 },
    { value: 1.5, rating: -7 },
    { value: 1.0, rating: -8 },
    { value: 0.5, rating: -9 },
    { value: 0.0, rating: -10 },
];

const FED_THRESHOLDS = [
    { value: 0.00, rating: 10 },
    { value: 0.25, rating: 9 },
    { value: 0.50, rating: 8 },
    { value: 0.75, rating: 7 },
    { value: 1.00, rating: 6 },
    { value: 1.25, rating: 5 },
    { value: 1.50, rating: 4 },
    { value: 1.75, rating: 3 },
    { value: 2.00, rating: 2 },
    { value: 2.25, rating: 1 },
    { value: 2.50, rating: 0 },
    { value: 2.75, rating: -1 },
    { value: 3.00, rating: -2 },
    { value: 3.25, rating: -3 },
    { value: 3.50, rating: -4 },
    { value: 3.75, rating: -5 },
    { value: 4.00, rating: -6 },
    { value: 4.25, rating: -7 },
    { value: 4.50, rating: -8 },
    { value: 4.75, rating: -9 },
    { value: 5.00, rating: -10 },
];

const WALCL_THRESHOLDS = [
    { value: 10.0, rating: 10 },
    { value: 9.0, rating: 9 },
    { value: 8.0, rating: 8 },
    { value: 7.0, rating: 7 },
    { value: 6.0, rating: 6 },
    { value: 5.0, rating: 5 },
    { value: 4.0, rating: 4 },
    { value: 3.0, rating: 3 },
    { value: 2.0, rating: 2 },
    { value: 1.0, rating: 1 },
    { value: 0.0, rating: 0 },
    { value: -1.0, rating: -1 },
    { value: -2.0, rating: -2 },
    { value: -3.0, rating: -3 },
    { value: -4.0, rating: -4 },
    { value: -5.0, rating: -5 },
    { value: -6.0, rating: -6 },
    { value: -7.0, rating: -7 },
    { value: -8.0, rating: -8 },
    { value: -9.0, rating: -9 },
    { value: -10.0, rating: -10 },
];

function calculateWalclRating(value) {
    return getRating(value, WALCL_THRESHOLDS);
}

function calculateFedRating(value) {
    return getRating(value, FED_THRESHOLDS);
}

function calculateM2Rating(value) {
    return getRating(value, M2_THRESHOLDS);
}
function calculateLiquidityCoverRating(value) {
    return getRating(value, LIQUIDITY_COVER_THRESHOLDS);
}

function calculateInterestBillRating(value) {
    return getRating(value, INTEREST_BILL_THRESHOLDS);
}


function calculateDeficitSurplusRating(value) {
    return getRating(value, DEFICIT_SURPLUS_THRESHOLDS);
}

function calculateGovGdpRating(value) {
    return getRating(value, GOV_GDP_THRESHOLDS);
}

function calculateUs10YRating(value) {
    return getRating(value, US_10_Y_THRESHOLDS);
}

function calculateRetailRating(value) {
    return getRating(value, RETAIL_THRESHOLDS);
}

function calculateBopRating(value) {
    return getRating(value, BOP_THRESHOLDS);
}


function calculateGdpRating(value) {
    return getRating(value, GDP_THRESHOLDS);
}

function calculateIpRating(value) {
    return getRating(value, IP_THRESHOLDS);
}

function calculatePmiRating(value) {
    return getRating(value, PMI_THRESHOLDS);
}

function calculateUmsciRating(value) {
    return getRating(value, UMSCI_THRESHOLDS);
}

function calculateBuildingPermitRating(value) {
    return getRating(value, BUILDING_PERMIT_THRESHOLDS);
}

function calculateNfpRating(value) {
    return getRating(value, NFP_THRESHOLDS);
}

function calculateIjcRating(value) {
    return getRating(value, IJC_THRESHOLDS);
}

function calculateCpiRating(value) {
    return getRating(value, CPI_THRESHOLDS);
}

function calculateCcpiRating(value) {
    return getRating(value, CCPI_THRESHOLDS);
}

function calculatePpiRating(value) {
    return getRating(value, PPI_THRESHOLDS);
}

function calculateCppiRating(value) {
    return getRating(value, CPPI_THRESHOLDS);
}

function calculateCpeRating(value) {
    return getRating(value, CPE_THRESHOLDS);
}

function calculateCcpeRating(value) {
    return getRating(value, CCPE_THRESHOLDS);
}

module.exports = {
    calculatePmiRating,
    calculateUmsciRating,
    calculateBuildingPermitRating,
    calculateNfpRating,
    calculateIjcRating,
    calculateCpiRating,
    calculateCcpiRating,
    calculatePpiRating,
    calculateCppiRating,
    calculateCpeRating,
    calculateCcpeRating,
    calculateIpRating,
    calculateGdpRating,
    calculateBopRating,
    calculateRetailRating,
    calculateUs10YRating,
    calculateGovGdpRating,
    calculateDeficitSurplusRating,
    calculateLiquidityCoverRating,
    calculateInterestBillRating,
    calculateM2Rating,
    calculateFedRating,
    calculateWalclRating
};

