export default async function getPriceEth(exchange, isUsd) {
    let pair = "ETH/AUD";
    let currency = "AUD";
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
    console.log(`Price of ${pair} on ${exchange} is ${lastPrice + " " + currency}`);
}