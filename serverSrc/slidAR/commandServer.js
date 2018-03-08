const _ = require('lodash');

const commandParser = require('./commandParser');
const {WebSocketServer} = require('../WebSocketServer');

let lastCommandObj;

function startNew() {

    const webSocketServer = new WebSocketServer();

    webSocketServer.onConnectCallback = (socketId, lastSentObject) => {
        webSocketServer.sendObject(socketId, {socketId});
        if(!_.isUndefined(lastCommandObj)) {
            webSocketServer.sendObject(socketId, lastCommandObj);
        }
    }

    webSocketServer.onMessageCallback = (commandString) => {
        console.log("message: " + commandString);
        lastCommandObj = commandParser.parse(commandString);
        if(!_.isUndefined(lastCommandObj)) {
            webSocketServer.sendObjectToAllSockets(lastCommandObj);
        }
    }

    webSocketServer.connect();
}

module.exports = {
    startNew
}