/**
 * Calculates the weighted Average price
 * @param pricesAndAmounts A nested array, containing two integars.
 *        Each nested array is share amount and an integar, and the price they were bought at as an integar.
 * @returns the weighted average price of all buys.
 *
 * To illustrate clearly, each nested array contains:
 *      at index 1:  Amount of shares
 *      at index 2:  The price those shares were bought at
 *
 * An example input --> `[[12, 143.23], [15, 188.99], [2, 500]]`.
 * This above array would indicate 12 shares bought at $143.23, and 15 bought at $188.99, and 2 shares bought at $500
 */
export default function weightedAverageTradePrice(pricesAndAmounts) {
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
