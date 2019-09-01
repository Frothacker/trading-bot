"use strict";
exports.__esModule = true;
/** Finds the average
 * @param takes an array of integar values
 * @returns an average integar
 *
 */
function getAverage(prices) {
    var total = 0;
    prices.map(function (x) {
        total += x;
    });
    var average = total / prices.length;
    return average;
}
exports["default"] = getAverage;
