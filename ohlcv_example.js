"use strict";

const ccxt = require("ccxt");
const asciichart = require("asciichart");
const asTable = require("as-table");
const log = require("ololog").configure({ locate: false });

require("ansicolor").nice;

//-----------------------------------------------------------------------------
(async function main() {
    // experimental, not yet implemented for all exchanges
    // your contributions are welcome ;)

    const timeframeMins = 15; // Candle thickness
    const index = 4; // [ timestamp, open, high, low, close, volume ]
    const ohlcv = await new ccxt.okcoinusd().fetchOHLCV(
        "BTC/USD",
        `${timeframeMins}m`
    );
    const lastPrice = ohlcv[ohlcv.length - 1][index]; // closing price
    let series = ohlcv.map(x => x[index]); // closing price

    // If series is too long, only present the 100 most recent closing prices on the chart. Else chart become un-readable in terminal due to too many data points in the terminal. Remove line below to chart the full output from 1m and 3m candles.
    series.length > 100
        ? (series = series.slice(series.length - 100, series.length - 1))
        : "";

    const bitcoinRate = ("₿ = $" + lastPrice).green;
    const chart = asciichart.plot(series, {
        height: 50,
        padding: "            "
    });
    log.yellow("\n" + chart, bitcoinRate, "\n");

    console.log("ohlcv length is\n");
    console.log(ohlcv.length);
    console.log("series length is\n");
    console.log(series.length);

    process.exit();
})();
