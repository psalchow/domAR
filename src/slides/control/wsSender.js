import * as _ from 'lodash';
import {slidarGlobal} from '../slidAR/slidarGlobal';

const _waitForOpen = (resolve) => {
    console.log("state: " + slidarGlobal.socket.readyState);
    if(slidarGlobal.socket.readyState == 0) {
        setTimeout(() => _waitForOpen(resolve), 100);
    }
    else {
        resolve();
    }
}

const _waitForReady = (resolve) => {
    if(slidarGlobal.socket.bufferedAmount > 0) {
        setTimeout(() => _waitForReady(resolve), 100);
    }
    else {
        resolve();
    }
}

export const send = (data) => {
    if(isOnline()) {
        return new Promise((readyResolve) => {
            new Promise((openResolve) => {
                _waitForOpen(openResolve);
            }).then(() => {
                slidarGlobal.socket.send(data);
                _waitForReady(readyResolve);
            })
        })

    }

    return Promise.resolve();
}

export const isOnline = () => {
    return _.isObject(slidarGlobal.socket);
}