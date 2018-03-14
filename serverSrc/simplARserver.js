const moment = require("moment");
const express = require('express');
const http = require('http');
const request = require("request");

const {WebSocketServer} = require('./WebSocketServer');

const DEFAULT_INTERVAL = 1000 * 5 * 60; // 5 min
const ERROR_FALLBACK_INTERVAL = 1000 * 10;

const customers = [
    {
        key: "DLAKF",
        company: "Deutsche Lufthansa AG"
    },
    {
        key: "MSFT",
        company: "Microsoft Corporation"
    },
    {
        key: "PBSFF",
        company: "ProsiebenSat.1 Media SE"
    }
];

function startServer() {
    const httpPort = process.argv[3] || 1338;
    const folder = process.argv[2] || 'build';

    const app = express();
    const absFolder = __dirname + '/' + folder;
    app.use('/', express.static(absFolder));

    http.createServer(app).listen(httpPort);

    console.log(`serving folder '${absFolder}' on port: ${httpPort}`);
}

function startWebSocketServer() {

    const webSocketPort = process.argv[4] || 1337;

    const webSocketServer = new WebSocketServer();

    webSocketServer.onMessageCallback = (messaqeString) => {
        webSocketServer.sendStringToAllSockets(messaqeString);
    };

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

function getUrl(customerKey) {
    return "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="
        + customerKey + "&interval=5min&apikey=NJLAVFTJ4P80CEWR&datatype=json"
}

function createStockDto(customer, index, jsonData) {
    try {
        const stockValue = JSON.parse(jsonData);
        const symbol = stockValue["Meta Data"]["2. Symbol"];
        const lastRefreshed = stockValue["Meta Data"]["3. Last Refreshed"];
        const currentValue = stockValue["Time Series (5min)"];

        const lastValues = [];
        let i = 0;
        for (let obj in currentValue) {
            let key = obj;
            let val = currentValue[key];

            switch (i) {
                case 0:
                    lastValues.push(val["2. high"]);
                    i++;
                    break;
                case 1:
                    lastValues.push(val["3. low"]);
                    i++;
                    break;
                default:
                    break;
            }
        }

        const shift = parseFloat(lastValues[0]) - parseFloat(lastValues[1]);
        const trend = (parseFloat(lastValues[0]) / parseFloat(lastValues[1])) * 100 - 100;

        return {
            id: index + 1,
            company: customer.key + " (" + customer.company + ")",
            abbr: symbol,
            updated: moment(lastRefreshed).locale("de").format("DD.MMMM YYYY"),
            value: {
                amount: parseFloat(lastValues[0]).toFixed(2),
                currency: "$"
            },
            shift: shift.toFixed(2),
            trend: trend.toFixed(2)
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}


async function loadStockData() {
    const stockPrices = [];

    try {
        customers.map(async (customer, index) => {
            const result = await fetchRemoteApi(getUrl(customer.key));
            const stockDto = createStockDto(customer, index, result);
            stockPrices.push(stockDto);
        })
    } catch (error) {
        console.error(error);
    }

    return stockPrices;
}

async function sendStockPrices() {
    // TODO: use an exisiting websocket instead of creating a new one (see code.js file)
    const webSocketPort = process.argv[4] || 1337;
    const webSocketServer = new WebSocketServer();
    webSocketServer.connect(webSocketPort);

    let stockPrices = await loadStockData();

    // TODO enable auto updates
    setInterval(async () => {
        // let stockPrices = await loadStockData();
        if (!stockPrices.includes(null)) {
            console.log("Sending ... ");
            webSocketServer.sendObjectToAllSockets(stockPrices)
        }
    }, 1000 * 5);
}

startServer();
if(process.argv[5] == "ticker") {
    sendStockPrices();
}
else {
    startWebSocketServer();
}
