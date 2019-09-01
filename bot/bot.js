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
exports.__esModule = true;
var generateBuys_1 = require("./generateBuys");
var ccxt = require("ccxt");
var fs = require("fs-extra");
// Get the API Key and secret formt eh Keystore File. 
var keyStoreFileData = JSON.parse(fs.readFileSync('./api_keys.json'));
var IRApiKey = keyStoreFileData.independantReserve.apiKey;
var IRSecret = keyStoreFileData.independantReserve.apiSecret;
// instantiate the Independant Reserve
var exchange = new ccxt['independentreserve']();
// Add the API Key and secrect to teh exchange. This permits the creation of orders, querying balance, and withdrawrals. 
exchange.apiKey = IRApiKey;
exchange.secret = IRSecret;
// getBalance(exchange, "ETH");
// let shareBuys = [[7, 600], [3, 599.9]];
// let averagePrice = weightedAverageTradePrice(shareBuys);
// console.log(averagePrice);
// console.log("Average of [2,3,4,5] is -->", getAverage([2, 3, 4, 5])); // as a test:  should return 3.5
// console.log("generated buys are -->", generateBuys(16, 0.5, 100));
// Needs Work
var buys = generateBuys_1["default"](0, 0, 1000);
console.log('buys are -->');
console.log(buys);
// console.log(buys.buys);
// console.log(buys.amounts);
// getPriceEth("independentreserve", false, 'API Key', 'API Secret', exchange);
// getPreviousTrades(exchange, "ETH/AUD");
// console.log(getAverage([12, 13, 14]));
