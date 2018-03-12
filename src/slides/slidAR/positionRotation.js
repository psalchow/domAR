import * as _ from 'lodash';

import {slideControl} from '../control/SlideControl';
import {createReverseStep} from './steps';

const toPosition = (slideId, newPosition) => {
    const currentPosition = getPosition(slideId);

    const x = _.isUndefined(newPosition.x) ? currentPosition.x : newPosition.x;
    const y = _.isUndefined(newPosition.y) ? currentPosition.y : newPosition.y;
    const z = _.isUndefined(newPosition.z) ? currentPosition.z : newPosition.z;

    slideControl.moveToAbsolutePosition(slideId, {x, y, z});

    return currentPosition;
}

const toPositionStepWithReverse = (slideId, newPosition) => {
    const step = {
        currentPosition: undefined,
        f: () => {
            if(_.isUndefined(this.currentPosition)) {
                this.currentPosition = getPosition(slideId);
            }
            toPosition(slideId, newPosition)
        },
        b: () => {
            toPosition(slideId, this.currentPosition)
        }
    }

    return createReverseStep(step);
}

const toRotation = (slideId, newRotation) => {
    slideControl.moveToAbsoluteRotation(slideId, newRotation);
}

const toPositionRotation = (slideId, newPosition, newRotation) => {
    slideControl.moveToAbsolutePositionRotation(slideId, newPosition, newRotation);
}

const getPosition = (slideId) => {
    const position = slideControl.getObject(slideId).position;
    return {...position};
}

const getRotation = (slideId) => {
    const rotation = slideControl.getObject(slideId).rotation;
    return {...rotation};
}

export const positionRotation = {
    toPosition, toRotation, toPositionRotation,
    toPositionStepWithReverse,
    getPosition, getRotation
}