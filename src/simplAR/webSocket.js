import * as webSocketHub from '../websocket/webSocketHub';
import * as webSocketSender from '../websocket/webSocketSender';

export const connect = (onMessageCallback) => {
    return webSocketHub.connect(1337, onMessageCallback);
}

export const send = (socket, messageString) => {
    return webSocketSender.send(socket, messageString);
}

export const webSocket = {
    connect, send
}
