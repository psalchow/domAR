const express = require('express');
const http = require('http');

const {WebSocketServer} = require('./WebSocketServer');

function startServer() {
    const httpPort = process.env.PORT||1338;
    const folder = process.argv[2] || 'build';

    const app = express();
    app.use('/', express.static(__dirname + '/' + folder));

    http.createServer(app).listen(httpPort);

    console.log(`serving folder '${folder}' on port: ${httpPort}`);
}

function startWebSocketServer() {

    const webSocketPort = process.env.PORT||1337;

    const webSocketServer = new WebSocketServer();

    webSocketServer.onMessageCallback = (messaqeString) => {
        webSocketServer.sendStringToAllSocktes(messaqeString);
    }

    webSocketServer.connect(webSocketPort);
}

startServer();
startWebSocketServer();
