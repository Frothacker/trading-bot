"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// --------------- Notes ---------------
// Consider 20 day MA vs 10 day MA trading bot based on https://www.tradingview.com/script/2cbpO8lO-MA-10-20-Crossover/
// 2.
//  Get Price history of last 30 30 days.
// Use getTrades. Docs are here --> https://github.com/ccxt/ccxt/wiki/Manual#trades-executions-transactions
var getPriceEth = require("./getPriceEth");
var ccxt = require("ccxt");
var IndResApiKey = 'API key';
var IndResSecret = 'API secret';
// instantiate the Independant Reserve
var exchange = new ccxt['independentreserve']();
exchange.apiKey = IndResApiKey;
exchange.secret = IndResSecret;
function getPreviousTrades(exchange, pair) {
    return __awaiter(this, void 0, void 0, function () {
        var trades;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exchange.fetchTrades(pair)];
                case 1:
                    trades = _a.sent();
                    console.log("\n\n " + trades[0]);
                    console.log(trades[0]);
                    return [2 /*return*/];
            }
        });
    });
}
getPreviousTrades(exchange, 'ETH/AUD');
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
 * An example input --> `[[12, 143.23], [15, 188.99], [2, 500]]`.
 * This above array would indicate 12 shares bought at $143.23, and 15 bought at $188.99, and 2 shares bought at $500
 */
function weightedAverageTradePrice(pricesAndAmounts) {
    // To get average price multiply each price you paid by the number of shares you bought at that price.
    // Then, add up all of these results.
    // divide by the total number of shares you purchased.
    // https://www.fool.com/knowledge-center/how-to-calculate-weighted-average-price-per-share.aspx
    // for each shareBuy, multiply price with amount of shares, to get total price.
    // add the amount of shares to total amount of shares.
    var totalPrice = 0;
    var totalShares = 0;
    for (var i = 0; i < pricesAndAmounts.length; i++) {
        totalShares = totalShares + pricesAndAmounts[i][0];
        totalPrice =
            totalPrice + pricesAndAmounts[i][0] * pricesAndAmounts[i][1];
    }
    // console.log(`total price paid for all shares is ${totalPrice}`);
    // console.log(`total number of shares is ${totalShares}`);
    /* divide total price by number of shares, to get average price per share. */
    var averagePrice = totalPrice / totalShares;
    // console.log(`The average price is ${averagePrice}`);
    return averagePrice;
}
function getBalance(exchangeName, isUsd, apiKey, secret) {
    return __awaiter(this, void 0, void 0, function () {
        var exchange, currency, pair, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    exchange = new ccxt[exchangeName]();
                    exchange.apiKey = apiKey;
                    exchange.secret = secret;
                    currency = "AUD";
                    pair = "ETH/AUD";
                    // change pair and eth key if usd is the comparison currency
                    if (isUsd) {
                        pair = "ETH/USD";
                        currency = "USD";
                    }
                    console.log('------------ Get Balance -----------');
                    console.log("API key is");
                    console.log(apiKey);
                    console.log("Secret is");
                    console.log(secret);
                    _b = (_a = console).log;
                    return [4 /*yield*/, exchange.fetchBalance()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}

var shareBuys = [[7, 600], [3, 599.9]];
var averagePrice = weightedAverageTradePrice(shareBuys);
/** generates buys prices that increase exponentially in distance from a set price ( e.g. the moving average. )
 * @param basepPrice would be the price to base all order off. e.g the Moving Average of 16
 * @param interval is gap between orders (small is)
 * @param maxPrice is the maximum price you want any orders set to.
 */
// TODO generate the buy amounts also.
// currently generate amounts match the exponential of the orders (using same exponential base and intervals).
function generateBuys(basePrice, interval, maxPrice) {
    var buys = [];
    var Amounts = [];
    var base = 2.7; // the 2.7 is an approximation of e. Could be any number, doesn't matter.
    for (var i = 0; i < 100; i = i + interval) {
        // calculate exponentially increasing price. (base to the power of)
        var newAmount = Math.pow(base, i);
        // add the basePrice to the price, to get the new order price
        var newOrder = basePrice + Math.pow(base, i);
        if (newOrder >= maxPrice) {
            break;
        }
        Amounts.push(newAmount);
        buys.push(newOrder);
    }
    return { buys: buys, Amounts: Amounts };
}
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
// console.log("Average of [2,3,4,5] is -->", getAverage([2, 3, 4, 5])); // as a test:  should return 3.5
// console.log("\n");
// console.log("generated buys are -->", generateBuys(16, 0.5, 100));
getPriceEth.getPriceEth("independentreserve", false, 'API Key', 'API Secret', exchange);
