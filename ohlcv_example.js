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

    const timeframeMins = "3m"; // time in minutes between prices
    const timeframeDays = "1d";
    const ohlcv = await new ccxt.kraken().fetchOHLCV("BTC/USD", timeframeDays);

    const index = 4; // [ timestamp, open, high, low, close, volume ], 4 == closing price

    const lastPrice = ohlcv[ohlcv.length - 1][index]; // closing price
    let series = ohlcv.map(x => x[index]); // list of closing prices

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
        ? (series = series.slice(series.length - 101, series.length - 1))
        : "";
    // ₿
    // Create chart
    const bitcoinRate = ("Ether = $" + lastPrice + " on kraken").green;
    const chart = asciichart.plot(series, {
        height: 17,
        padding: "            "
    });
    log.yellow("\n" + chart, bitcoinRate, "\n");

    console.log("ohlcv length is\n");
    console.log(ohlcv.length);
    console.log("series length is\n");
    console.log(series.length);

    let thirtyDayPastPrice = series[series.length - 31];
    console.log("Price of bitcoin 30 days ago was", thirtyDayPastPrice);

    process.exit();
})();
