require("typescript-require");
const ccxt = require("ccxt");
const fs = require("fs-extra");

// list of exchange id's to harvest data from
const exchangeIDs: Array<string> = ["kraken", "independentreserve", "bitfinex"];

//  exchange type
export default class Exchange {
    public exchange: any;
    public name: string;

    constructor(id: string) {
        try {
            const exchange = new ccxt[id]();
        } catch (e) {
            if (e) {
                throw Error(`Failed to create exchange for id ${id}`);
            }
        }
        this.name = id;
        this.exchange = exchange;
    }
}

/**
 * Gets the market for an exchange.
 * @param e The exchange, as an exchange type.
 * @returns an onject with the market id, and then the market data.
 */
const getMarket: any = async (e: Exchange) => {
    const output: string = await e.exchange.loadMarkets();
    return { id: e.exchange.id, markets: output };
};

/**
 * Gets the currencies supported by an exchange.
 * @param e The exchange, as an exchange type.
 * @returns an onject with the market id, and then the market data.
 */
const fetchCurrencies: any = async (e: Exchange) => {
    // If the exchange can't return currencies, throw error
    if (e.exchange.hasFetchCurrencies === false) {
        throw Error("This currency has no 'fetchCurrencies' method");
    }
    const output: string = await e.exchange.fetchCurrencies();
    return { currencies: output };
};

/**
 * Creates exchanges given their IDs
 * @param exchangeIDs An Array of exchanges, as exchange types.
 * @returns an array of exchange objects
 */
const createExchanges = (exchangeIDs: Array<string>) => {
    let exchanges: Array<Exchange> = [];
    for (const id of exchangeIDs) {
        console.log(`Retreived ${id}`);
        let exchange: Exchange = new Exchange(id);
        exchanges.push(exchange);
    }
    return exchanges;
};

/**
 * Gets the markets from the entered exchanges
 * @param exchangeIDs An Array of exchanges, as exchange types.
 * @returns writes the retreived exchange data to a json file.
 */
const getMarkets = async (exchanges: Array<Exchange>) => {
    let output: Map<string, object> = new Map();

    // iterate through ids and write all the data from each exchange to a json output.
    for (const exchange of exchanges) {
        // get market
        const market: any = await getMarket(exchange);
        output[exchange.exchange.name] = market;
    }
    fs.writeFileSync("./markets.json", JSON.stringify(output));
};

/**
 * Gets the prices of requested currencies from an exchange
 * @param exchange An exchange, as an Exchange type.
 * @param
 * @returns writes the retreived exchange data to a json file.
 */
const getCurrencies = async (
    exchangeIDs: Array<string>,
    currencies: Array<string>
) => {
    let output: Map<string, object> = new Map();

    // Iterate through ids and write all the currency data from each exchange to a json file.
    for (const id of exchangeIDs) {
        let exchange: Exchange = new Exchange(id);
        let currencies: any;

        try {
            const currencies: any = await fetchCurrencies(exchange);
        } catch (e) {
            if (e) {
                console.log(`No currencies fetched for ${id}`);
                continue;
            }
        }

        output[id] = currencies;
    }
    fs.writeFileSync("./currencies.json", JSON.stringify(output));
};

const exchanges: Array<Exchange> = createExchanges([
    "kraken",
    "independentreserve",
    "bitfinex",
    "bittrex"
]);
getMarkets(exchanges);
// getPrices(exchanges);

const getEverything = async () => {
    const exchange = exchanges[0].exchange;

    console.log(await exchange.loadMarkets());

    let btcusd1 = exchange.markets["BTC/USD"]; // get market structure by symbol
    let btcusd2 = exchange.market("BTC/USD"); // same result in a slightly different way

    let btcusdId = exchange.marketId("BTC/USD"); // get market id by symbol

    let symbols = exchange.symbols; // get an array of symbols
    let symbols2 = Object.keys(exchange.markets); // same as previous line

    console.log(exchange.id, symbols); // print all symbols

    let currencies = exchange.currencies; // a list of currencies

    if (exchanges[0].exchange.has["fetchOrders"]) {
        const orders = exchanges[0].exchange.fetchOrders(
            "XBT",
            exchanges[0].exchange.milliseconds() - 86400000,
            20,
            {}
        );
        console.log(orders);
    }
};

getEverything();

// getCurrencies();

// harvestData(exchangeIDs);

// // load the kracken markets.
// let krakenId: string = "kraken";
// let kraken: any = new ccxt[krakenId]();
// console.log(kraken.id, await kraken.loadMarkets());

// let kraken = new ccxt.kraken();
// let bitfinex = new ccxt.bitfinex({ verbose: true });
// let huobi = new ccxt.huobi();
// let okcoinusd = new ccxt.okcoinusd({
//     apiKey: "YOUR_PUBLIC_API_KEY",
//     secret: "YOUR_SECRET_PRIVATE_KEY"
// });

// const exchangeId = "binance",
//     exchangeClass = ccxt[exchangeId],
//     exchange = new exchangeClass({
//         apiKey: "YOUR_API_KEY",
//         secret: "YOUR_SECRET",
//         timeout: 30000,
//         enableRateLimit: true
//     });

// console.log(kraken.id, await kraken.loadMarkets());
// console.log(bitfinex.id, await bitfinex.loadMarkets());
// console.log(huobi.id, await huobi.loadMarkets());

// console.log(kraken.id, await kraken.fetchOrderBook(kraken.symbols[0]));
// console.log(bitfinex.id, await bitfinex.fetchTicker("BTC/USD"));
// console.log(huobi.id, await huobi.fetchTrades("ETH/CNY"));

// console.log(okcoinusd.id, await okcoinusd.fetchBalance());

// sell 1 BTC/USD for market price, sell a bitcoin for dollars immediately
// console.log(
//     okcoinusd.id,
//     await okcoinusd.createMarketSellOrder("BTC/USD", 1)
// );

// // buy 1 BTC/USD for $2500, you pay $2500 and receive ฿1 when the order is closed
// console.log(
//     okcoinusd.id,
//     await okcoinusd.createLimitBuyOrder("BTC/USD", 1, 2500.0)
// );

// // pass/redefine custom exchange-specific order params: type, amount, price or whatever
// // use a custom order type
// bitfinex.createLimitSellOrder("BTC/USD", 1, 10, { type: "trailing-stop" });
