import {addHtmlPageWithId} from './addHtmlPage';
import {ar} from './ar';
import {firstParamSet, paramValue} from '../util/query';
import {webSocket} from './webSocket';

export const simplAR = {
    ...ar,
    addHtmlPageWithId,
    firstParamSet, paramValue,
    ...webSocket
}
