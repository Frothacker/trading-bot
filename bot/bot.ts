/** What I want  to do
 * 1. Get current price of ether
 * 1.1 Calculate the current value of this account.
 * 2. Get the swing in price over the last 1 month
 * 2.1 Get the highest and lowest price in previous 30 days.
 * 2.2 Calculate the amount of leeway above and below.
 * 3. Use the leeway on wither side as the upper bound for generateing buys and sells for this month.
 * 3.1 Generate Correctly wieght buys and sells amounts and at the correct prices.
 * 3.2 Check that It dosent exceed the maximum balance of the account.
 * 4. Delete previous buys and sells
 * 5. Send the new buys and sells to the exchange
 * 6. Record and buys and sells that occur.
 * 7. Calculate the total expendetures and total revenues.
 * 7.1 Calculate total profit or loss for this month.
 **/

// --------------- Notes ---------------
// Consider 20 day MA vs 10 day MA trading bot based on https://www.tradingview.com/script/2cbpO8lO-MA-10-20-Crossover/

// 2.
// Get Price history of last 30 30 days.
// Use getTrades. Docs are here --> https://github.com/ccxt/ccxt/wiki/Manual#trades-executions-transactions

import getPriceSymbol from './getPriceSymbol';
import getPreviousTrades from './getPreviousTrades';
import getAverage from './getAverage';
import generateBuys from './generateBuys';
import weightedAverageTradePrice from './weightedAverageTradePrice';
import getBalance from './getBalance';

import generateExchanges from './generateExchanges';

async function getSpreadOverLastMonth(exchange, symbol: string) {
    // Get closing price
    const timeframeMins = 30; // Candle thickness
    const index = 4; // [ timestamp, open, high, low, close, volume ], 4 == closing price
    let allOHLCV = []
    let since;

    if (exchange.has['fetchOHLCV']) {
        // let since = exchange.milliseconds () - 86400000 // -1 day from now // alternatively, fetch from a certain starting datetime
        since = exchange.parse8601('2019-09-01T00:00:00Z')
        console.log(`the first since is  ${since}`);

        let timeframe = "60m"
        while (since < exchange.milliseconds()) {
            const limit = 1000 // change for your limit
            // sleep(limit);
            //  fetchOHLCV (symbol, timeframe = '1m', since = undefined, limit = undefined, params = ˓→{})
            const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, since, limit)
            if (ohlcv.length) {
                since = ohlcv[ohlcv.length - 1]['0']
                console.log(since);
                allOHLCV = allOHLCV.concat(ohlcv)
            } else {
            }
        }
    }

    console.log(allOHLCV);
    console.log(allOHLCV.length);

    // fetchOHLCV (symbol, timeframe = '1m', since = undefined, limit = undefined, params = {})
    const ohlcv = await exchange.fetchOHLCV(symbol, `${timeframeMins}m`, since);
    const lastPrice = ohlcv[ohlcv.length - 1][index]; // closing price
    let series = ohlcv.map(x => x[index]); // series of closing prices

    // console.log(`[getSpreadOverLastMonth] Series of closing prices are: ${series}`);
    // console.log(`[getSpreadOverLastMonth] The price of ${pair} on ${exchange.name} is ${lastPrice + " " + pair}`);
    // console.log(ohlcv);
    // console.log(ohlcv.length);
}

// a function to execute asyncronous things. 
async function main() {

    let e = [];
    e = await generateExchanges();

    let bittrex = e[0];
    let IR = e[1];

    getSpreadOverLastMonth(IR, "ETH/AUD");

    // getBalance(IR, "ETH");

    // let shareBuys = [[7, 600], [3, 599.9]];
    // let averagePrice = weightedAverageTradePrice(shareBuys);
    // console.log(averagePrice);

    // console.log("Average of [2,3,4,5] is -->", getAverage([2, 3, 4, 5])); // as a test:  should return 3.5
    // console.log("generated buys are -->", generateBuys(16, 0.5, 100));

    // Needs Work - as it may just gets point along an expoential curve, as compared tofitting an expoenetional curve inside of the bounds. 
    // const buys = generateBuys(0,1,100);
    // console.log('buys are -->');
    // console.log(buys);

    // console.log(buys.buys);
    // console.log(buys.amounts);

    // getPriceSymbol(IR, "ETH/AUD");



    // getPreviousTrades(IR, "ETH/AUD");


    // console.log(getAverage([12, 13, 14]));

    // const result  = await IR.createLimitBuyOrder("ETH/AUD", 1, 100);

    // not yet supported by IR
    // const openOrder = await IR.fetchOpenOrders("ETH/AUD");


}
main();
