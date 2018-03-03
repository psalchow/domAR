import * as _ from 'lodash';
import {slidarGlobal} from '../slidAR/slidarGlobal';

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
        slidarGlobal.socket.send(data);
        return new Promise((resolve) => {
            _waitForReady(resolve);
        })
    }

    return Promise.resolve();
}

export const isOnline = () => {
    return _.isObject(slidarGlobal.socket);
}