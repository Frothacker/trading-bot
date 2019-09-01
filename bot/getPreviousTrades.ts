export default async function getPreviousTrades(exchange, pair) {
    let trades = await exchange.fetchTrades(pair);
    console.log(`\n\n ${trades[0]}`);
    console.log(trades[0]);
}