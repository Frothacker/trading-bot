// TODO dosent work with bittrex.  error is --> TICK_NOT_PROVIDED


/**
 * Gets the closing price a Symbol on an exchange
 * @param exchange An instantiated exhcange object
 * @param pair A Currency Pair supported on the passed exchange. e.g "BTC/USD"
 */
export default async function getPriceSymbol(exchange, 
    pair: string) {
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
    console.log(`Price of ${pair} on ${exchange.name} is ${lastPrice + " " + pair}`);
    return lastPrice;
}