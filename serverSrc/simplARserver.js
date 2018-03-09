const moment = require("moment");
const express = require('express');
const http = require('http');
const request = require("request");

const {WebSocketServer} = require('./WebSocketServer');

function startServer() {
    const httpPort = process.argv[3] || 1338;
    const folder = process.argv[2] || 'build';

    const app = express();
    app.use('/', express.static(__dirname + '/' + folder));

    http.createServer(app).listen(httpPort);

    console.log(`serving folder '${folder}' on port: ${httpPort}`);
}

function startWebSocketServer() {

    const webSocketPort = process.argv[4] || 1337;

    const webSocketServer = new WebSocketServer();

    webSocketServer.onMessageCallback = (messaqeString) => {
        webSocketServer.sendStringToAllSockets(messaqeString);
    }

    webSocketServer.connect(webSocketPort);
}

function fetchRemoteApi(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) return reject(error);
            resolve(body);
        });
    });
}

async function sendStockPrices() {

    // TODO: use an exisiting websocket instead of creating a new one (see code.js file)
    const webSocketPort = process.argv[4] || 1337;
    const webSocketServer = new WebSocketServer();
    webSocketServer.connect(webSocketPort);

    const stockPrices = [];

    // TODO move to config-map or something similar
    const lufthansaStock = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=DLAKF&interval=5min&apikey=NJLAVFTJ4P80CEWR&datatype=json"

    try {
        // TODO put these lines into a separate function
        const result = await fetchRemoteApi(lufthansaStock);

        const stockValue = JSON.parse(result);
        const symbol = stockValue["Meta Data"]["2. Symbol"];
        const lastRefreshed = stockValue["Meta Data"]["3. Last Refreshed"];
        const currentValue = stockValue["Time Series (5min)"];

        const lastValues = [];
        let i = 0;
        for (obj in currentValue) {
            let key = obj;
            let val = currentValue[key];

            lastValues.push(val["1. open"]);

            if (i >= 1)
                break;
            i++;
        }

        const shift = parseFloat(lastValues[0]) - parseFloat(lastValues[1]);
        const trend = (parseFloat(lastValues[0]) / parseFloat(lastValues[1])) * 100 - 100;

        const returnValue = {
            id: 1,
            company: "Deutsche Lufthansa AG",
            abbr: symbol,
            updated: moment(lastRefreshed).locale("de").format("DD.MMMM YYYY"),
            value: {
                amount: parseFloat(lastValues[0]).toFixed(2),
                currency: "$"
            },
            shift: shift.toFixed(2),
            trend: trend.toFixed(2)
        };

        stockPrices.push(returnValue);

    } catch (error) {
        console.error(error);
    }

    let i = 0;
    setInterval(() => {
        if (stockPrices.length > 0) {
            console.log("Sending ... " + i++);
            webSocketServer.sendObjectToAllSockets(stockPrices[0]) // TODO send multiple stock data objects
        } else {
            throw new Error("invalid stock object. please restart node server") // TODO refetch on error
        }
    }, 1000 * 5)
}

startServer();
// startWebSocketServer();
sendStockPrices();
