const commandParser = require('./commandParser');
const {WebSocketServer} = require('./WebSocketServer');

let lastCommandObj;

function startNew() {

    const webSocketServer = new WebSocketServer();

    webSocketServer.onConnectCallback = (socketId, lastSentObject) => {
        webSocketServer.sendObject(socketId, {socketId});
        webSocketServer.sendObject(socketId, lastSentObject);
    }

    webSocketServer.onMessageCallback = (commandString) => {
        console.log(commandString);
        lastCommandObj = commandParser.parse(commandString);
        webSocketServer.sendObjectToAllSockets(lastCommandObj);
    }

    webSocketServer.connect();
}

module.exports = {
    startNew
}