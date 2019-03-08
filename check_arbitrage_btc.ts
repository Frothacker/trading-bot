"use strict";

const ccxt = require("ccxt");
const asciichart = require("asciichart");
const asTable = require("as-table");
const log = require("ololog").configure({ locate: false });
const fs = require("fs-extra");

import Exchange from "./harvester";

(async function main() {
    let exchanges: Exchange[] = [];
    const okcoinusd: Exchange = new ccxt.okcoinusd();
    const bitfinex: Exchange = new ccxt.bitfinex();

    exchanges.push(okcoinusd);

    const timeframe: string = "1m"; // Candle thickness
    const index: number = 4; // [ timestamp, open, high, low, close, volume ]

    // for each exchange, print its current price.
    for (const exchange in exchanges) {
        const ohlcv = await exchange.fetchOHLCV("BTC/USD", `${timeframe}`);
        //                              last item in ohlvc array, the closing price index
        const lastPrice: number = ohlcv[ohlcv.length - 1][index]; // closing price
        let series: number[] = ohlcv.map(x => x[index]); // closing price

        console.log(lastPrice);
        console.log(series);
        console.log(Exchange.exchange.timeframes);
    }

    process.exit();
})();
