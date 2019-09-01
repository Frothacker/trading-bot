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
var ccxt = require("ccxt");
var fs = require("fs-extra");
// loop through all the exchanges in the file and instantiate them with their api keys
function generateExchanges() {
    return __awaiter(this, void 0, void 0, function () {
        var instantiatedExchanges, path, keyStoreFileData, exchangeList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("ee");
                    instantiatedExchanges = [];
                    path = fs.ensureFileSync('./api_keys.json');
                    return [4 /*yield*/, JSON.parse(fs.readFileSync("./api_keys.json", 'utf8'))];
                case 1:
                    keyStoreFileData = _a.sent();
                    exchangeList = ccxt.exchanges;
                    exchangeList.forEach(function (exchangeName) {
                        if (keyStoreFileData[exchangeName] != undefined) {
                            var exchangeKeyStoreData = keyStoreFileData[exchangeName];
                            // instantiate the exchange 
                            var exchange = new ccxt[exchangeName];
                            // get the API and secrect from datastore
                            var apiKey = exchangeKeyStoreData.apiKey;
                            var secret = exchangeKeyStoreData.apiSecret;
                            // Add the API Key and secret to exchange. This permits the creation of orders, querying balance, and withdrawrals. 
                            exchange.apiKey = apiKey;
                            exchange.secret = secret;
                            // add this exchange to the array of exchanges.
                            instantiatedExchanges.push(exchange);
                        }
                    });
                    return [2 /*return*/, instantiatedExchanges];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var e, bittrex, IR;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateExchanges()];
                case 1:
                    e = _a.sent();
                    bittrex = e[0];
                    IR = e[1];
                    console.log(IR.name);
                    return [2 /*return*/];
            }
        });
    });
}
main();
// getBalance(exchange, "ETH");
// let shareBuys = [[7, 600], [3, 599.9]];
// let averagePrice = weightedAverageTradePrice(shareBuys);
// console.log(averagePrice);
// console.log("Average of [2,3,4,5] is -->", getAverage([2, 3, 4, 5])); // as a test:  should return 3.5
// console.log("generated buys are -->", generateBuys(16, 0.5, 100));
// Needs Work
// const buys = generateBuys(0,1,100);
// console.log('buys are -->');
// console.log(buys);
// console.log(buys.buys);
// console.log(buys.amounts);
// getPriceEth(exchange, false);
// getPreviousTrades(exchange, "ETH/AUD");
// console.log(getAverage([12, 13, 14]));
// TODO when exhcange is online 
// async function buyOrder(symbol, amount, price) {
//     const feedback = exchange.createLimitBuyOrder(symbol, amount, price);
//     return feedback;
// }
