"use strict";
require("typescript-require");
const ccxt = require("ccxt");
const fs = require("fs-extra");

const harvestData = async () => {
    let IRId: string = "independentreserve";
    let independentreserve: any = new ccxt[IRId]();
    const output: string = await independentreserve.loadMarkets();
    console.log(output);
    fs.writeFileSync("./data.json", JSON.stringify(output));

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
