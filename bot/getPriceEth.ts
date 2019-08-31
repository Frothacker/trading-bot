
const ccxt = require('ccxt');

export async function getPriceEth(exchangeName, isUsd, apiKey, secret, exchange) {
    // let exchange = new ccxt[exchangeName]();
    // exchange.apiKey = apiKey;
    // exchange.secret = secret;
    let currency = "AUD";
    let pair = "ETH/AUD";
    // change pair and eth key if usd is the comparison currency
    if (isUsd) {
        pair = "ETH/USD";
        currency = "USD";
    }
    // Get closing price
    const timeframeMins = 3; // Candle thickness
    const index = 4; // [ timestamp, open, high, low, close, volume ], 4 == closing price
    // const ohlcv = await new ccxt.kraken().fetchOHLCV(
    //     pair,
    //     `${timeframeMins}m`
    // );
    const ohlcv = await exchange.fetchOHLCV(pair, `${timeframeMins}m`);
    const lastPrice = ohlcv[ohlcv.length - 1][index]; // closing price
    let series = ohlcv.map(x => x[index]); // series of closing prices
    console.log(`Price of ${pair} on ${exchangeName} is ${lastPrice + " " + currency}`);
}
