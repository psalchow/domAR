import * as _ from 'lodash';
import * as d3 from 'd3';
import {getGlobalRoot, getTween} from "./global";
import {setArPositionRotation} from "../ar/arPositions";
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
