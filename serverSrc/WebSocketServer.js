const _ = require('lodash');
const WebSocket = require('ws');

const NOP = () => {};

const callCallback = (callback, paramArray) => {
    if(_.isFunction(callback)) {
        callback.apply(undefined, paramArray);
    }
}

class WebSocketServer {

    constructor() {
        this.sockets = {};
        this.lastSentObject = undefined;
        this.onMessageCallback = NOP;
        this.onCloseCallback = NOP;
        this.onErrorCallback = NOP;
        this.onConnectCallback = NOP;
    }

    *idGenerator(start) {
        let id = start;
        while(true) {
            yield id;
            id++;
        }
    }

    connect() {
        const port = process.env.PORT||1337;
        const wss = new WebSocket.Server({port});

        const _id = this.idGenerator(0);

        wss.on('connection', (ws) => {
            const socketId = _id.next().value;
            this.addSocket(socketId, ws);

            ws.on('message', (message) => {
                console.log("received message: " + message);
                callCallback(this.onMessageCallback, [message]);
            });

            ws.on('error', (error) => {
                console.error(error);
                callCallback(this.onErrorCallback, [error]);
            });

            ws.on('close', () => {
                console.log('closed: ' + socketId);
                this.removeSocket(socketId);
                callCallback(this.onCloseCallback);
            });

            callCallback(this.onConnectCallback, [socketId, this.lastSentObject]);
        });
    }

    addSocket(socketId, socket) {
        console.log("Add socket: " + socketId);
        this.sockets[socketId] = socket;
    }

    removeSocket(socketId) {
        delete this.sockets[socketId];
    }

    _sendObject(socket, obj) {
        const strObj = JSON.stringify(obj);
        console.log("send: " + strObj);
        socket.send(strObj, (error) => {
            if(!_.isEmpty(error)) {
                console.log(error);
            }
            else {
                this.lastSentObject = obj;
            }
        });
    }

    sendObject(socketId, obj) {
        const socket = this.sockets[socketId];
        this._sendObject(socket, obj);
    }

    sendObjectToAllSockets(obj) {
        _.forOwn(this.sockets, (socket, socketId) => {
            console.log("send to socket " + socketId);
            this._sendObject(socket, obj);
        })
    }
}

module.exports = {WebSocketServer};

