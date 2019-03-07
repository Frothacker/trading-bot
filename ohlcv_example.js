"use strict";

const ccxt = require("ccxt");
const asciichart = require("asciichart");
const asTable = require("as-table");
const log = require("ololog").configure({ locate: false });
const fs = require("fs-extra");

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

    // output to a file
    const filePath = "./closingValues.json";
    fs.ensureFileSync(filePath);
    const timestampIndex = 0;
    const output = { indexKey: series }; ///// currently Cannot get this index key to hold a timestamp. It just interprets 'indexKey' as a string;

    fs.writeFileSync(filePath, JSON.stringify(output));
    console.log(`\nClosing values written to ${filePath}\n`);

    // Format for chart
    // If series is too long, only present the 100 most recent closing prices on the chart. Else chart become un-readable in terminal due to too many data points in the terminal. Remove line below to chart the full output from 1m and 3m candles.
    series.length > 100
        ? (series = series.slice(series.length - 100, series.length - 1))
        : "";

    // Create chart
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
