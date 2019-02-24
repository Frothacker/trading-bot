require("typescript-require");
const ccxt = require("ccxt");
const fs = require("fs-extra");

//  exchange type
export default class Exchange {
    public exchange: any;

    constructor(id: string) {
        try {
            const exchange = new ccxt[id]();
        } catch (e) {
            if (e) {
                throw Error(`Failed to create exchange for id ${id}`);
            }
        }

        this.exchange = exchange;
    }
}

// return the market avaialabe for an exchange.
const getMarket: any = async (e: Exchange) => {
    const output: string = await e.exchange.loadMarkets();
    return { id: e.exchange.id, markets: output };
};

// get all the data from all exchanges.
const harvestData = async () => {
    // list of exchange id's to harvest data from
    const exchangeIDs: Array<string> = [
        "kraken",
        "independentreserve",
        "bitfinex"
    ];

    let output: Map<string, object> = new Map();

    // iterate through ids and write all the data from each exchange to a json output.
    for (const id of exchangeIDs) {
        console.log(id);
        let exchange: Exchange = new Exchange(id);

        // get market
        const market: any = await getMarket(exchange);
        // get symbols
        // get ticker per symbol?
        // get balance (need to create with access keys)
        output[id] = market;
    }
    fs.writeFileSync("./markets.json", JSON.stringify(output));

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
};

harvestData();
