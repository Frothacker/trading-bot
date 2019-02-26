const ccxt = require("ccxt");

let id = "independentreserve";
let exchange = new ccxt[id]();

//  20 day MA vs 10 day MA trading bot based on https://www.tradingview.com/script/2cbpO8lO-MA-10-20-Crossover/

/** 
 * Calculates the weighted Average price
 * @param pricesAndAmounts A nested array, containing two integars. 
 *        Each nested array is share amount and an integar, and the price they were bought at as an integar.
 * @returns the weighted average price of all buys. 
 *
 * To illustrate clearly each nested array contains:
 *      at index 1:  Amount of shares
 *      at index 2:  The price those shares were bought at
 * 
 * An example input --> [[12, 143.23], [15, 188.99], [2, 500]].
 * This above array would indicate 12 shares bought at $143.23, and 15 bought at $188.99, and 2 shares bought at $500
 */
function weightedAverageTradePrice(pricesAndAmounts) {
    // To get average price multiply each price you paid by the number of shares you bought at that price.
    // Then, add up all of these results.
    // divide by the total number of shares you purchased.
    // https://www.fool.com/knowledge-center/how-to-calculate-weighted-average-price-per-share.aspx

    // for each shareBuy, multiply price with amount of shares, to get total price.
    // add the amount of shares to total amount of shares.
    let totalPrice = 0;
    let totalShares = 0;
    for (let i = 0; i < pricesAndAmounts.length; i++) {
        totalShares = totalShares + pricesAndAmounts[i][0];
        totalPrice =
            totalPrice + pricesAndAmounts[i][0] * pricesAndAmounts[i][1];
    }
    // console.log(`total price paid for all shares is ${totalPrice}`);
    // console.log(`total number of shares is ${totalShares}`);

    /* divide total price by number of shares, to get average price per share. */
    const averagePrice = totalPrice / totalShares;

    // console.log(`The average price is ${averagePrice}`);
    return averagePrice;
}

let shareBuys = [[7, 600], [3, 599.9]];
averagePrice = weightedAverageTradePrice(shareBuys);



/** generates buys prices that increase exponentially in distance from a set price ( e.g. the moving average. )
 * @param basepPrice would be the price to base all order off. e.g the Moving Average of 16
 * @param interval is gap between orders (small is)
 * @param maxPrice is the maximum price you want any orders set to.
 */
// TODO generate the buy amounts also.
// currently generate amounts match the exponential of the orders (using same exponential base and intervals).
function generateBuys(basePrice, interval, maxPrice) {
    const buys = [];
    const Amounts = [];
    const base = 2.7; // the 2.7 is an approximation of e. Could be any number, doesn't matter.
    for (let i = 0; i < 100; i = i + interval) {
        // calculate exponentially increasing price. (base to the power of)
        const newAmount = base ** i;

        // add the basePrice to the price, to get the new order price
        const newOrder = basePrice + base ** i;

        if (newOrder >= maxPrice) {
            break;
        }

        Amounts.push(newAmount);
        buys.push(newOrder);
    }

    return { buys, Amounts };
}

console.log("generated buys are -->", generateBuys(16, 0.5, 100));



/** Finds the average
 * @param takes an array of integar values
 * @returns an average integar 
 *
 */
function getAverage(prices) {
    let total = 0;

    prices.map(x => {
        total += x;
    });

    const average = total / prices.length;
    return average;
}

console.log("Average of [2,3,4,5] is -->", getAverage([2,3,4,5]));   // as a test:  should return 3.5
