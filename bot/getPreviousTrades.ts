export default async function getPreviousTrades(exchange, pair) {
    let trades = await exchange.fetchTrades(pair);
    console.log(trades);
    console.log(trades[0]);
}