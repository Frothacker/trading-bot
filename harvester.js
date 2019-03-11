"use strict";
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
var _this = this;
exports.__esModule = true;
require("typescript-require");
var ccxt = require("ccxt");
var fs = require("fs-extra");
//  exchange type
var Exchange = /** @class */ (function () {
    function Exchange(id) {
        try {
            this.exchange = new ccxt[id]();
        }
        catch (e) {
            if (e) {
                throw Error("Failed to create exchange for id " + id);
            }
        }
        this.name = id;
    }
    return Exchange;
}());
exports["default"] = Exchange;
/**
 * Gets the market for an exchange.
 * @param e The exchange, as an exchange type.
 * @returns an onject with the market id, and then the market data.
 */
var getMarket = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, e.exchange.loadMarkets()];
            case 1:
                output = _a.sent();
                return [2 /*return*/, { id: e.exchange.id, markets: output }];
        }
    });
}); };
/**
 * Gets the currencies supported by an exchange, returned in an object. (kindo f a useless function? it already exists below).
 * @param e The exchange, as an exchange type.
 * @returns an onject with the market id, and then the market data.
 */
var fetchCurrencies = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // If the exchange can't return currencies, throw error
                if (e.exchange.hasFetchCurrencies === false) {
                    throw Error("This currency has no 'fetchCurrencies' method");
                }
                return [4 /*yield*/, e.exchange.fetchCurrencies()];
            case 1:
                output = _a.sent();
                return [2 /*return*/, { currencies: output }];
        }
    });
}); };
/**
 * Creates exchanges given their IDs
 * @param exchangeIDs An Array of exchanges, as exchange types.
 * @returns an array of exchange objects
 */
var createExchanges = function (exchangeIDs) {
    var exchanges = [];
    for (var _i = 0, exchangeIDs_1 = exchangeIDs; _i < exchangeIDs_1.length; _i++) {
        var id = exchangeIDs_1[_i];
        var exchange = new Exchange(id);
        console.log("Retreived " + exchange.name);
        exchanges.push(exchange);
    }
    return exchanges;
};
/**
 * Gets the markets from the entered exchanges
 * @param exchangeIDs An Array of exchanges, as exchange types.
 * @returns writes the retreived exchange data to a json file.
 */
var getMarkets = function (exchanges) { return __awaiter(_this, void 0, void 0, function () {
    var output, _i, exchanges_1, exchange, market;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                output = new Map();
                _i = 0, exchanges_1 = exchanges;
                _a.label = 1;
            case 1:
                if (!(_i < exchanges_1.length)) return [3 /*break*/, 4];
                exchange = exchanges_1[_i];
                return [4 /*yield*/, getMarket(exchange)];
            case 2:
                market = _a.sent();
                output[exchange.exchange.name] = market;
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                fs.outputJsonSync("./markets.json", JSON.stringify(output));
                return [2 /*return*/];
        }
    });
}); };
/**
 * Gets the prices of requested currencies from an exchange
 * @param exchanges An array of exchanges, as an Exchange types.
 * @returns writes the retreived exchange data to a json file.
 */
var getCurrencies = function (exchanges) { return __awaiter(_this, void 0, void 0, function () {
    var output, _i, exchanges_2, exchange, currencies, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                output = new Map();
                _i = 0, exchanges_2 = exchanges;
                _a.label = 1;
            case 1:
                if (!(_i < exchanges_2.length)) return [3 /*break*/, 7];
                exchange = exchanges_2[_i];
                currencies = void 0;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, exchange.exchange.fetchCurrencies()];
            case 3:
                currencies = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                if (e_1) {
                    console.log("No currencies fetched for " + exchange.exchange.id);
                    return [3 /*break*/, 6];
                }
                return [3 /*break*/, 5];
            case 5:
                console.log(currencies);
                output[exchange.exchange.id] = currencies;
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7:
                fs.writeFileSync("./currencies.json", JSON.stringify(output));
                return [2 /*return*/];
        }
    });
}); };
var exchanges = createExchanges([
    "kraken",
    "independentreserve",
    "bitfinex",
    "bittrex"
]);
/**
 * Checks the BTC prices accross given exchanges
 * @param exchanges An array of exchanges, as an Exchange type.
 * @param
 * @returns writes the retreived exchange data to a json file.
 */
var checkArbitrageBTC = function (exchanges) { return __awaiter(_this, void 0, void 0, function () {
    var _loop_1, _i, exchanges_3, exchange;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_1 = function (exchange) {
                    var ohlcv, pair, timeframe, symbols, e_2, symbols_1, timeframes, index_1, lastPrice, series;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ohlcv = void 0;
                                pair = "BTC/USD";
                                timeframe = "1h";
                                // first load markets
                                return [4 /*yield*/, exchange.exchange.loadMarkets()];
                            case 1:
                                // first load markets
                                _a.sent();
                                symbols = exchange.exchange.symbols;
                                if (!symbols.includes(pair)) {
                                    console.log("Failed to fetch OHLCV from " + exchange.exchange.id + ", this exhcange does not support " + pair + "\n");
                                    return [2 /*return*/, "continue"];
                                }
                                if (!(exchange.exchange.has.fetchOHLCV === true)) return [3 /*break*/, 6];
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, exchange.exchange.fetchOHLCV(pair, timeframe)];
                            case 3:
                                ohlcv = _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                e_2 = _a.sent();
                                // if error, throw informative log and continue to next exchange
                                console.log("\nFailed to fetch OHLCV for " + pair + " using " + timeframe + " candles on " + exchange.exchange.id);
                                symbols_1 = exchange.exchange.symbols;
                                timeframes = exchange.exchange.timeframes;
                                console.log("Available timeframes for exchange ${exchange.exchange.id} are");
                                console.log(timeframes);
                                return [2 /*return*/, "continue"];
                            case 5:
                                index_1 = 4;
                                console.log(ohlcv[ohlcv.length - 1]);
                                lastPrice = ohlcv[ohlcv.length - 1][index_1];
                                console.log(lastPrice);
                                series = ohlcv.slice(-80).map(function (x) { return x[index_1]; });
                                console.log("\n The exchange rate of " + pair + " at " + exchange.exchange.id + " is " + lastPrice + "\n");
                                return [3 /*break*/, 7];
                            case 6:
                                console.log("\nFailed to fetch OHLCV for " + pair + " using " + timeframe + " candles on " + exchange.exchange.id + " because this exchange does not support the function fetchOHLCV \n");
                                _a.label = 7;
                            case 7: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, exchanges_3 = exchanges;
                _a.label = 1;
            case 1:
                if (!(_i < exchanges_3.length)) return [3 /*break*/, 4];
                exchange = exchanges_3[_i];
                return [5 /*yield**/, _loop_1(exchange)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
getMarkets(exchanges); // call first so that ccxt returns data.
// getCurrencies(exchanges);
checkArbitrageBTC(exchanges);
var getEverything = function () { return __awaiter(_this, void 0, void 0, function () {
    var exchange, currencies, currenciesFilePath, data, symbol, btcusd1, btcusd2, marketId, symbols, symbols2, orderbookFilePath, dayInMilliseconds, days, time, since, orders, ticker;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                exchange = exchanges[0].exchange;
                return [4 /*yield*/, exchange.loadMarkets()];
            case 1:
                _a.sent();
                currencies = exchange.currencies;
                currenciesFilePath = "./" + exchange.name + "/Currencies.json";
                try {
                    fs.ensureFileSync(currenciesFilePath); // ensure a file exists here
                    fs.writeFileSync(currenciesFilePath, JSON.stringify(currencies)); // write the currencies to a file + build directories to get there
                }
                catch (err) {
                    console.error(err);
                }
                data = fs.readJsonSync(currenciesFilePath);
                console.log(data["ADA"]);
                symbol = "LTC/BTC";
                btcusd1 = exchange.markets[symbol];
                btcusd2 = exchange.market(symbol);
                marketId = exchange.marketId(symbol);
                symbols = exchange.symbols;
                symbols2 = Object.keys(exchange.markets);
                if (!exchange.has["fetchOrderBook"]) return [3 /*break*/, 4];
                console.log("fetching orders from " + exchange.name);
                orderbookFilePath = "./" + exchange.name + "/" + symbol + "/Orderbook.json";
                dayInMilliseconds = 86400000;
                days = 0.00000000001;
                time = days * dayInMilliseconds;
                since = exchange.milliseconds() - 1;
                console.log("\nsince is\n", since);
                return [4 /*yield*/, exchange.fetchOrderBook(symbol, since, 20, {})];
            case 2:
                orders = _a.sent();
                fs.ensureFileSync(orderbookFilePath);
                fs.writeFileSync(orderbookFilePath, JSON.stringify(orders));
                console.log("\n\nThe current orders on " + exchange.name + " since " + days + " days ago is -->\n", orders);
                return [4 /*yield*/, exchange.publicGetTicker({ pair: marketId })];
            case 3:
                ticker = _a.sent();
                console.log("\n\nThe current ticker price on " + exchange.name + " is -->\n", ticker.result);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
// getEverything();
// getCurrencies();
// harvestData(exchangeIDs);
// // load the kracken markets.
// let krakenId: string = "kraken";
// let kraken: any = new ccxt[krakenId]();
// console.log(kraken.id, await kraken.loadMarkets());
// let kraken = new ccxt.kraken();
// let bitfinex = new ccxt.bitfinex({ verbose: true });
// let huobi = new ccxt.huobi();
// let okcoinusd = new ccxt.okcoinusd({
//     apiKey: "YOUR_PUBLIC_API_KEY",
//     secret: "YOUR_SECRET_PRIVATE_KEY"
// });
// const exchangeId = "binance",
//     exchangeClass = ccxt[exchangeId],
//     exchange = new exchangeClass({
//         apiKey: "YOUR_API_KEY",
//         secret: "YOUR_SECRET",
//         timeout: 30000,
//         enableRateLimit: true
//     });
// console.log(kraken.id, await kraken.loadMarkets());
// console.log(bitfinex.id, await bitfinex.loadMarkets());
// console.log(huobi.id, await huobi.loadMarkets());
// console.log(kraken.id, await kraken.fetchOrderBook(kraken.symbols[0]));
// console.log(bitfinex.id, await bitfinex.fetchTicker("BTC/USD"));
// console.log(huobi.id, await huobi.fetchTrades("ETH/CNY"));
// console.log(okcoinusd.id, await okcoinusd.fetchBalance());
// sell 1 BTC/USD for market price, sell a bitcoin for dollars immediately
// console.log(
//     okcoinusd.id,
//     await okcoinusd.createMarketSellOrder("BTC/USD", 1)
// );
// // buy 1 BTC/USD for $2500, you pay $2500 and receive ฿1 when the order is closed
// console.log(
//     okcoinusd.id,
//     await okcoinusd.createLimitBuyOrder("BTC/USD", 1, 2500.0)
// );
// // pass/redefine custom exchange-specific order params: type, amount, price or whatever
// // use a custom order type
// bitfinex.createLimitSellOrder("BTC/USD", 1, 10, { type: "trailing-stop" });
