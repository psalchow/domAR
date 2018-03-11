import {slideControl} from '../control/SlideControl';
import {createReverseStep} from './steps';

const toPosition = (slideId, newPosition) => {
    slideControl.moveToAbsolutePosition(slideId, newPosition);
}

const toPositionStepWithReverse = (slideId, newPosition) => {
    const currentPosition = getPosition(slideId);

    const step = {
        f: () => toPosition(slideId, newPosition),
        b: () => toPosition(slideId, currentPosition)
    }

    return createReverseStep(step);
}

const toRotation = (slideId, newRotation) => {
    slideControl.moveToAbsoluteRotation(slideId, newRotation);
}

const toPositionRotation = (slideId, newPosition, newRotation) => {
    slideControl.moveToAbsolutePositionRotation(slideId, newPosition, newRotation);
}

const addToPositionRotation = (slideId, addPosition, addRotation) => {
    const object = slideControl.getObject(slideId);

    object.position.x += addPosition.x;
    object.position.y += addPosition.y;
    object.position.z += addPosition.z;

    object.rotation.x += addRotation.x;
    object.rotation.y += addRotation.y;
    object.rotation.z += addRotation.z;
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
    addToPositionRotation,
    getPosition, getRotation
}