import * as d3 from 'd3';
import {getTween} from "./global";
import * as move from '../ar/move';

export const toPosition = (pageId, newPosition, duration) => {
    d3.selectAll("#" + pageId)
        .each(function(d) {
            move.toPosition(d.object, newPosition, getTween(), duration);
        })
}

export const toRotation = (pageId, newRotation, duration) => {
    d3.selectAll("#" + pageId)
        .each(function(d) {
            move.toRotation(d.object, newRotation, getTween(), duration);
        })
}

export const getPosition = (pageId) => {
    let position;
    d3.selectAll("#" + pageId)
        .each(function(d) {
            position = move.getPosition(d.object);
        })

    return position;
}

export const getRotation = (pageId) => {
    let rotation;
    d3.selectAll("#" + pageId)
        .each(function(d) {
            rotation = move.getRotation(d.object);
        })

    return rotation;
}
