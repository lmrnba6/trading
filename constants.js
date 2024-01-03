// const PMI_URL = 'https://ca.investing.com/economic-calendar/ism-manufacturing-pmi-173'
// const NPMI_URL = 'https://ca.investing.com/economic-calendar/ism-non-manufacturing-pmi-176'
// const UMCSI_URL = 'https://tradingeconomics.com/united-states/consumer-confidence'
const moment = require('moment'); // require

const fredExcelUrl = (code, period) => `https://fred.stlouisfed.org/graph/fredgraph.xls?bgcolor=%23e1e9f0&chart_type=line&drp=0&fo=open%20sans&graph_bgcolor=%23ffffff&height=450&mode=fred&recession_bars=on&txtcolor=%23444444&ts=12&tts=12&width=1318&nt=0&thu=0&trc=0&show_legend=yes&show_axis_titles=yes&show_tooltip=yes&id=${code}&scale=left&cosd=1952-11-01&coed=${moment().format('yyyy-mm-dd')}&line_color=%234572a7&link_values=false&line_style=solid&mark_type=none&mw=3&lw=2&ost=-99999&oet=99999&mma=0&fml=a&fq=${period}&fam=avg&fgst=lin&fgsnd=2020-02-01&line_index=1&transformation=lin&vintage_date=${moment().format('yyyy-mm-dd')}&revision_date=${moment().format('yyyy-mm-dd')}&nd=1952-11-01`
const PMI_URL = 'https://tradingeconomics.com/united-states/manufacturing-pmi'
const NPMI_URL = 'https://tradingeconomics.com/united-states/non-manufacturing-pmi'
const UMCSI_CODE = 'UMCSENT'
const BP_CODE = 'PERMIT'
const NFP_CODE = 'PAYEMS'
const IJC_CODE = 'ICSA'
const CPI_CODE = 'CPIAUCSL'
const CCPI_CODE = 'CPILFESL'
const PPI_CODE = 'PPIFIS'
const CPPI_CODE = 'PPIFES'
const CPE_CODE = 'PCEPI'
const CCPE_CODE = 'PCEPILFE'
const BOP_CODE = 'USAB6BLTT02STSAQ'
const IP_CODE = 'INDPRO'
const GDP_CODE = 'GDPC1'
const HOUSING_CODE = 'HOUST'
const RETAIL_CODE = 'RRSFS'
const US10Y_CODE = 'IRLTLT01USM156N'
const GDP_GNP_CODE = 'GDP'
const FEDERAL_DEBT_CODE = 'GFDEBTN'
const DEFICIT_SURPLUS_CODE = 'FYFSGDA188S'
const INTEREST_BILL_CODE = 'FYOINT'
const FEDERAL_RECEIPT = 'FYFR'
const M2_CODE = 'M2SL'
const DFF_CODE = 'DFF'
const WALCL_CODE = 'WALCL'

module.exports = {
    PMI_URL,
    NPMI_URL,
    NFP_CODE,
    IJC_CODE,
    CPI_CODE,
    CCPI_CODE,
    PPI_CODE,
    CPPI_CODE,
    CPE_CODE,
    CCPE_CODE,
    BP_CODE,
    UMCSI_CODE,
    IP_CODE,
    GDP_CODE,
    BOP_CODE,
    HOUSING_CODE,
    RETAIL_CODE,
    US10Y_CODE,
    GDP_GNP_CODE,
    FEDERAL_DEBT_CODE,
    DEFICIT_SURPLUS_CODE,
    INTEREST_BILL_CODE,
    FEDERAL_RECEIPT,
    M2_CODE,
    DFF_CODE,
    WALCL_CODE,
    fredExcelUrl
}

