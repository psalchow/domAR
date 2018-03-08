import * as _ from 'lodash';

import {log} from '../util/log';
import * as query from '../util/query';
import {slidarGlobal} from '../slides/slidAR/slidarGlobal';

const WS_HOST_PARAM = "wsHost";

const host = window.location.hostname;
const port = 1337;

export const connect = (onMessageCallback) => {
    const wsHostParam = query.paramValue(WS_HOST_PARAM);

    if(_.isEmpty(wsHostParam)) {
        return
    }

    const wsHost = (wsHostParam === "1" ? host : wsHostParam);

    const socket = new WebSocket("ws://" + wsHost + ":" + port);

    socket.onmessage = function (event) {
        const commandStr = event.data;
        log.info(commandStr);
        onMessageCallback(commandStr);
    }

    slidarGlobal.socket = socket;
}
