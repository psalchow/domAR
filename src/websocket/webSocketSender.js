import {log} from '../util/log';

/* eslint eqeqeq: "off" */
const _waitForOpen = (socket, resolve) => {
    if(socket.readyState == 0) {
        log.info("state: " + socket.readyState);
        setTimeout(() => _waitForOpen(socket, resolve), 100);
    }
    else {
        resolve();
    }
}

const _waitForReady = (socket, resolve) => {
    if(socket.bufferedAmount > 0) {
        log.info("bufferedAmount: " + socket.bufferedAmount);
        setTimeout(() => _waitForReady(socket, resolve), 100);
    }
    else {
        resolve();
    }
}

export const send = (socket, data) => {
    return new Promise((readyResolve) => {
        new Promise((openResolve) => {
            _waitForOpen(socket, openResolve);
        }).then(() => {
            socket.send(data);
            _waitForReady(socket, readyResolve);
        })
    })
}
