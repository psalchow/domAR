const express = require('express');
const http = require('http');

const {WebSocketServer} = require('./WebSocketServer');
const stockService = require("./stockARserver");

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
    };

    webSocketServer.connect(webSocketPort);
}

startServer();
if (process.argv[5] == "ticker") {
    stockService.sendStockPrices();
}
else {
    startWebSocketServer();
}
