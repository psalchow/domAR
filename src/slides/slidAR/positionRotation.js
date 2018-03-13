import * as _ from 'lodash';

import {slideControl} from '../control/SlideControl';
import {createReverseStep} from './steps';

const setXYZ = (newXYZ, currentXYZ) => {
    const x = _.isUndefined(newXYZ.x) ? currentXYZ.x : newXYZ.x;
    const y = _.isUndefined(newXYZ.y) ? currentXYZ.y : newXYZ.y;
    const z = _.isUndefined(newXYZ.z) ? currentXYZ.z : newXYZ.z;

    return {x, y, z}
}

const toPosition = (slideId, newPosition) => {
    const currentPosition = getPosition(slideId);

    slideControl.moveToAbsolutePosition(slideId, setXYZ(newPosition, currentPosition));

    return currentPosition;
}

const toRotation = (slideId, newRotation) => {
    const currentRotation = getRotation(slideId);

    slideControl.moveToAbsoluteRotation(slideId, setXYZ(newRotation, currentRotation));

    return currentRotation;
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

const toRotationStepWithReverse = (slideId, newRotation) => {
    const step = {
        currentRotation: {},
        f: () => {
            if(_.isUndefined(this.currentRotation)) {
                const cr = getRotation(slideId);
                debugger
                this.currentRotation.x = cr._x;
                this.currentRotation.y = cr._y;
                this.currentRotation.z = cr._z;
            }
            toRotation(slideId, newRotation)
        },
        b: () => {
            toRotation(slideId, this.currentRotation)
        }
    }

    return createReverseStep(step);
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
    toRotationStepWithReverse,
    getPosition, getRotation
}