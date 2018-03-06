import {getArPositionRotation, setPositionRotationOnObject} from './arPositions';

const DEFAULT_DURATION = 1000;

// deprecated
const nextPositionAndRotation = (object) => {
    console.warn("nextPositionAndRotation is deprecated");

    const type = object._data.getType();
    const totalNum = object._data.getTotalNum();
    const nextIndex = object._data.getNextIndex();
    const positionFunction = object._data.getPositionFunction();
    const {position, rotation} = getArPositionRotation(type, nextIndex, totalNum, positionFunction);

    return {nextIndex, position, rotation}
}

const fwdBackPositionAndRotation = (object, trueIfFwd) => {
    const type = object._data.getType();
    const totalNum = object._data.getTotalNum();
    const nextIndex = trueIfFwd ? object._data.getPrevIndex() : object._data.getNextIndex();
    const positionFunction = object._data.getPositionFunction();
    const offset = object._data.getOffset();
    const {position, rotation} = getArPositionRotation(type, nextIndex, totalNum, positionFunction, offset);

    return {nextIndex, position, rotation}
}

const refreshPositionAndRotation = (object) => {
    const type = object._data.getType();
    const totalNum = object._data.getTotalNum();
    const index = object._data.getIndex();
    const positionFunction = object._data.getPositionFunction();
    const offset = object._data.getOffset();
    const {position, rotation} = getArPositionRotation(type, index, totalNum, positionFunction, offset);

    return {index, position, rotation}
}

export const moveTo = (object, newPosition, newRotation, TWEEN, duration = DEFAULT_DURATION) => {
    if(TWEEN) {
        new TWEEN.Tween(object.position)
            .to({x: newPosition.x, y: newPosition.y, z: newPosition.z}, (1 + Math.random()) * duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({x: newRotation.x, y: newRotation.y, z: newRotation.z}, (1 + Math.random()) * duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(this)
            .to( {}, duration * 2 )
            .start();
    }
    else {
        setPositionRotationOnObject(object, newPosition, newRotation);
    }
}

// deprecated
export const next = (object, TWEEN) => {
    console.warn("next is deprecated");

    const {nextIndex, position, rotation} = nextPositionAndRotation(object);

    moveTo(object, position, rotation, TWEEN);

    object._data.setIndex(nextIndex);
}

export const fwd = (object, TWEEN) => {
    fwdBack(object, TWEEN, true)
}

export const back = (object, TWEEN) => {
    fwdBack(object, TWEEN, false)
}

const fwdBack = (object, TWEEN, trueIfFwd) => {
    const {nextIndex, position, rotation} = fwdBackPositionAndRotation(object, trueIfFwd);

    moveTo(object, position, rotation, TWEEN);

    object._data.setIndex(nextIndex);
}

const moveOffset = (object, TWEEN, offset) => {
    object._data.addToOffset(offset);
    const {position, rotation} = refreshPositionAndRotation(object);

    moveTo(object, position, rotation, TWEEN);
}

export const allNext = (allObjects, TWEEN) => {
    allObjects.forEach((object) => {
        next(object, TWEEN);
    })
}

export const allFwdBack = (allObjects, TWEEN, trueIfFwd) => {
    allObjects.forEach((object) => {
        fwdBack(object, TWEEN, trueIfFwd);
    })
}

export const allFwd = (allObjects, TWEEN) => {
    allFwdBack(allObjects, TWEEN, true);
}

export const allBack = (allObjects, TWEEN) => {
    allFwdBack(allObjects, TWEEN, false);
}

export const allMoveOffset = (allObjects, TWEEN, offset) => {
    allObjects.forEach((object) => {
        moveOffset(object, TWEEN, offset);
    })
}
