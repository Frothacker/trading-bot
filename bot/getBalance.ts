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
    // To do Refactor out into separate function
    // Check to make sure the API Keya nd Secret are passed in
    if (!exchange.secret) {
        throw new Error('[getBalance] The exchange given has no api secret added. Please add your api Secret to the exchange instance before passing to this function');
    }
    else if (!exchange.apiKey) {
        throw new Error('[getBalance] The exchange given has no api Key added. Please add you api Key to the exchange instance before passing to this function');
    }
    else {
        // Get the balance
        balanceData = await exchange.fetchBalance();
    }
    //If currency is provided, check if the currency is supported by the exchange. 
    if (exchange.currencies.includes(`${currency}`)) {
        const currencyData = balanceData;
    }
    else {
    }
}
