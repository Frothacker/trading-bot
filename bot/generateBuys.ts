// Dosen't appear to work yet - where's the. s


/** generates buys prices that increase exponentially in distance from a set price ( e.g. the moving average. )
 * @param basePrice the price to base all the orders off. Represents the x-axis asymptote. e.g the Moving Average of $16 over the month
 * @param interval is gap in units between orders (small means more orders), e.g. 5
 * @param maxPrice is the maximum price that an order shall not exceed. e.g. 100
 */
// TODO generate the buy amounts also.
// currently generate amounts match the exponential of the orders (using same exponential base and intervals).
export default function generateBuys(basePrice, interval, maxPrice) {
    const buys = [];
    const amounts = [];
    const base = 1.5; // adjusts the steepness of the curve. Higher number means a larger gap between orders.
    for (let i = 0; i < 100; i = i + interval) {
        // calculate exponentially increasing price. (base to the power of)
        const newAmount = base ** i;
        // add the basePrice to the price, to get the new order price
        const newOrder = basePrice + base ** i;
        if (newOrder >= maxPrice) {
            break;
        }
        amounts.push(newAmount);
        buys.push(newOrder);
    }
    return { buys, amounts };
}
