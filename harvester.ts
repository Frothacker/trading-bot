require("typescript-require");
const ccxt = require("ccxt");
const fs = require("fs-extra");

//  exchange type
export default class Exchange {
    public exchange: any;
    public name: string;

    constructor(id: string) {
        try {
            this.exchange = new ccxt[id]();
        } catch (e) {
            if (e) {
                throw Error(`Failed to create exchange for id ${id}`);
            }
        }
        this.name = id;
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
 * Gets the currencies supported by an exchange, returned in an object. (kindo f a useless function? it already exists below).
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
        let exchange: Exchange = new Exchange(id);
        console.log(`Retreived ${exchange.name}`);
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
    fs.outputJsonSync(`./markets.json`, JSON.stringify(output));
};

/**
 * Gets the prices of requested currencies from an exchange
 * @param exchanges An array of exchanges, as an Exchange types.
 * @returns writes the retreived exchange data to a json file.
 */
const getCurrencies = async (exchanges: Array<Exchange>) => {
    let output: Map<string, object> = new Map();

    // Iterate through ids and write all the currency data from each exchange to a json file.
    for (const exchange of exchanges) {
        let currencies: any;

        try {
            currencies = await exchange.exchange.fetchCurrencies();
        } catch (e) {
            if (e) {
                console.log(
                    `No currencies fetched for ${exchange.exchange.id}`
                );
                continue;
            }
        }

        console.log(currencies);

        output[exchange.exchange.id] = currencies;
    }
    fs.writeFileSync("./currencies.json", JSON.stringify(output));
};

const exchanges: Array<Exchange> = createExchanges([
    "kraken",
    "independentreserve",
    "bitfinex",
    "bittrex"
]);

/**
 * Checks the BTC prices accross given exchanges
 * @param exchanges An array of exchanges, as an Exchange type.
 * @param
 * @returns writes the retreived exchange data to a json file.
 */
const checkArbitrageBTC = async (exchanges: Array<Exchange>) => {
    // Iterate through ids and write all the currency data from each exchange to a json file.
    for (const exchange of exchanges) {
        let ohlcv: number[];
        const pair: string = "BTC/USD";
        const timeframe: string = "1h"; // TODO add check for timeframe

        // first load markets
        await exchange.exchange.loadMarkets();
        const symbols = exchange.exchange.symbols; // get an array of symbols

        if (!symbols.includes(pair)) {
            console.log(
                `Failed to fetch OHLCV from ${
                    exchange.exchange.id
                }, this exhcange does not support ${pair}\n`
            );
            continue;
        }

        // if the exchange supports fetching OHLCV, then get it, else throw an informative error.
        if (exchange.exchange.has.fetchOHLCV === true) {
            try {
                ohlcv = await exchange.exchange.fetchOHLCV(pair, timeframe);
            } catch (e) {
                // if error, throw informative log and continue to next exchange
                console.log(
                    `\nFailed to fetch OHLCV for ${pair} using ${timeframe} candles on ${
                        exchange.exchange.id
                    }`
                );
                const symbols = exchange.exchange.symbols;
                const timeframes = exchange.exchange.timeframes;
                console.log(
                    "Available timeframes for exchange ${exchange.exchange.id} are"
                );
                console.log(timeframes);
                continue;
            }

            const index: number = 4; // [ timestamp, open, high, low, close, volume ]

            console.log(ohlcv[ohlcv.length - 1]); // For some reason the Bitfinex ohlvc call Bitfinex is not returning truthy values.

            const lastPrice: number = ohlcv[ohlcv.length - 1][index]; // closing price

            const series: number[] = ohlcv.slice(-80).map(x => x[index]); // closing price

            console.log(
                `\n The exchange rate of ${pair} at ${
                    exchange.exchange.id
                } is ${lastPrice}\n`
            );
        } else {
            console.log(
                `\nFailed to fetch OHLCV for ${pair} using ${timeframe} candles on ${
                    exchange.exchange.id
                } because this exchange does not support the function fetchOHLCV \n`
            );
        }
    }
};

getMarkets(exchanges); // call first so that ccxt returns data.
// getCurrencies(exchanges);
checkArbitrageBTC(exchanges);

const getEverything = async () => {
    const exchange = exchanges[0].exchange; // bittrex

    await exchange.loadMarkets();

    let currencies = exchange.currencies; // a list of currencies

    const currenciesFilePath: string = `./${exchange.name}/Currencies.json`;
    try {
        fs.ensureFileSync(currenciesFilePath); // ensure a file exists here
        fs.writeFileSync(currenciesFilePath, JSON.stringify(currencies)); // write the currencies to a file + build directories to get there
    } catch (err) {
        console.error(err);
    }

    const data = fs.readJsonSync(currenciesFilePath); // read currencies
    console.log(data["ADA"]);

    let symbol = "LTC/BTC";
    let btcusd1 = exchange.markets[symbol]; // get market structure by symbol
    let btcusd2 = exchange.market(symbol); // same result in a slightly different way

    let marketId = exchange.marketId(symbol); // get market id by symbol

    let symbols = exchange.symbols; // get an array of symbols
    let symbols2 = Object.keys(exchange.markets); // same as previous line

    // console.log(exchange.id, symbols); // print all symbols

    // // if the currency exists

    if (exchange.has["fetchOrderBook"]) {
        console.log(`fetching orders from ${exchange.name}`);
        let orderbookFilePath: string = `./${
            exchange.name
        }/${symbol}/Orderbook.json`;

        const dayInMilliseconds: number = 86400000;
        const days: number = 0.00000000001;
        const time: number = days * dayInMilliseconds;

        const since: number = exchange.milliseconds() - 1;
        console.log("\nsince is\n", since);

        const orders = await exchange.fetchOrderBook(symbol, since, 20, {});
        fs.ensureFileSync(orderbookFilePath);
        fs.writeFileSync(orderbookFilePath, JSON.stringify(orders));

        console.log(
            `\n\nThe current orders on ${
                exchange.name
            } since ${days} days ago is -->\n`,
            orders
        );

        let ticker = await exchange.publicGetTicker({ pair: marketId });
        console.log(
            `\n\nThe current ticker price on ${exchange.name} is -->\n`,
            ticker.result
        );
    }
};

// getEverything();

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
