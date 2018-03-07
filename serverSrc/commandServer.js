const _ = require('lodash');
const WebSocket = require('ws');

const commandParser = require('./commandParser');

const sockets = {};

let lastCommandObj;

function addSocket(socketId, socket) {
    console.log("Add socket: " + socketId);
    sockets[socketId] = socket;
}

function removeSocket(socketId) {
    delete sockets[socketId];
}

function sendObject(socket, obj) {
    const strObj = JSON.stringify(obj);
    console.log("send: " + strObj);
    socket.send(strObj, function (error) {
        if(!_.isEmpty(error)) {
            console.log(error);
        }
    });
}

function sendObjectToAllSockets(obj) {
    _.forOwn(sockets, function (socket, socketId) {
        console.log("send to socket " + socketId);
        sendObject(socket, obj);
    })
}

function* idGenerator(start) {
    let id = start;
    while(true) {
        yield id;
        id++;
    }
}

function start() {
    const port = process.env.PORT||1337;
    const wss = new WebSocket.Server({port});

    const _id = idGenerator(0);

    wss.on('connection', function(ws) {
        const socketId = _.isUndefined(ws._ultron) ? _id.next().value : ws._ultron.id;
        addSocket(socketId, ws);

        ws.on('message', function(commandString) {
            console.log(commandString);
            lastCommandObj = commandParser.parse(commandString);
            sendObjectToAllSockets(lastCommandObj);
        });

        ws.on('error', (error) => console.log(error));

        ws.on('close', () => {
            console.log('disconnected: ' + socketId);
            removeSocket(socketId);
        });

        sendObject(ws, {
            command: "connected",
            socketId
        });
        if(!_.isUndefined(lastCommandObj)) {
            sendObject(ws, lastCommandObj);
        }
    });
}

function websocketServer() {

}


module.exports = {
    start, sendObject, sendObjectToAllSockets
}