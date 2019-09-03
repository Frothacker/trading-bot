import ccxt = require("ccxt");
import fs = require("fs-extra");
// loop through all the exchanges in the file and instantiate them with their api keys
export default async function generateExchanges() {
    let instantiatedExchanges = [];
    // Get Keystore File. Pasre it from JSON into an object.
    const path = fs.ensureFileSync('./api_keys.json');
    const keyStoreFileData = await JSON.parse(fs.readFileSync(`./api_keys.json`, 'utf8'));
    // console.log(keyStoreFileData.independantreserve);
    // get a list of all ccxt supported exchanges
    const exchangeList = ccxt.exchanges;
    exchangeList.forEach(exchangeName => {
        if (keyStoreFileData[exchangeName] != undefined) {
            let exchangeKeyStoreData = keyStoreFileData[exchangeName];
            // instantiate the exchange 
            const exchange = new ccxt[exchangeName];
            // get the API and secrect from datastore
            const apiKey = exchangeKeyStoreData.apiKey;
            const secret = exchangeKeyStoreData.apiSecret;
            // Add the API Key and secret to exchange. This permits the creation of orders, querying balance, and withdrawrals. 
            exchange.apiKey = apiKey;
            exchange.secret = secret;
            // add this exchange to the array of exchanges.
            instantiatedExchanges.push(exchange);
        }
    });
    return instantiatedExchanges;
}
