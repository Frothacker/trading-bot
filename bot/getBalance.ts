// Currently broken


/**
 * Fetches the balance at a given exchange.
 * Only works if the exchange instance passed in has been authenticated with and Key and secret.
 * If the currency variable is added, function returns the balance of that currency only.
 * @param exchange An instance of an exchange
 * @param currency the name of the desired Currency
 */
export default async function getBalance(exchange, currency: String) {
    let balanceData;
    
    // TODO. It appears that exhcange.currencies returns an empty object. 
    let unsupportedCurrency = true;
    console.log(exchange.currencies);

    // create an array of the currencies supported
    for (const index of exchange.currencies) {
        index === currency ? unsupportedCurrency = false : "";
    }
    // console.log(unsupportedCurrency);

    // To do Refactor out into separate function
    // Check to make sure the API Key and Secret are passed in
    if (!exchange.secret) {
        throw new Error('[getBalance] The exchange given has no api secret added. Please add your api Secret to the exchange instance before passing to this function');
    }
    else if (!exchange.apiKey) {
        throw new Error('[getBalance] The exchange given has no api Key added. Please add you api Key to the exchange instance before passing to this function');
    }
    //Check if the currency is supported by the exchange. 
    // TODO. It appears that exhcange.currencies returns an empty object. 
    // else if (unsupportedCurrency) {
    //     throw new Error(`[getBalance] ${exchange.name} does not support the currency ${currency}`);
    // }
    else {
        // Get the balance
        balanceData = await exchange.fetchBalance();
        console.log(balanceData)
        return balanceData;
    }

}
