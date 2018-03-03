import * as _ from 'lodash';

import {slidarGlobal} from '../slidAR/slidarGlobal';
import {slideControl} from './SlideControl';
import * as wsSender from './wsSender';

const createStepPart = () => {
    const slideIds = slideControl.getSlideIds();
    const stepPartStr = slideIds.reduce((_stepPartStr, slideId) => {
        const stepsObject = slideControl.getStepsObject(slideId);
        if(!_.isUndefined(stepsObject)) {
            return _stepPartStr + "&" + slideId + "=" + stepsObject.currentStepNumber;
        }
    }, "");

    return stepPartStr;
}

const createStatusString = (nextPrev) => {
    return createStepPart() + "#" + slideControl.getCurrentSlideId() + "#" + (nextPrev || "");
}

export const sendStatusString = (nextPrev) => {
    if(wsSender.isOnline() && slidarGlobal.isMaster) {
        const statusString = createStatusString(nextPrev);
        const command = {command: "status", argument: statusString};
        const commandString = JSON.stringify(command);

        return wsSender.send(commandString);
    }
    else {
        return Promise.resolve();
    }
}
