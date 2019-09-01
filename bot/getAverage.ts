/** Finds the average
 * @param takes an array of integar values
 * @returns an average integar
 *
 */
export default function getAverage(prices) {
    let total = 0;
    prices.map(x => {
        total += x;
    });
    const average = total / prices.length;
    return average;
}
