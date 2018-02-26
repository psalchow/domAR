import * as d3 from 'd3';

const vsprintf = require('sprintf-js').vsprintf;

export const SIDE_NAME_FRONT = "front";
export const SIDE_NAME_BACK = "back";
export const SIDE_NAME_TOP = "top";
export const SIDE_NAME_BOTTOM = "bottom";
export const SIDE_NAME_LEFT = "left";
export const SIDE_NAME_RIGHT = "right";

const front = {
    name: SIDE_NAME_FRONT,
    transform: "translateZ(%s)",
    color: "#d4e157"
}

const back = {
    name: SIDE_NAME_BACK,
    transform: "rotateY(-180deg) translateZ(%s)",
    color: "#0f9d58"
}

const left = {
    name: SIDE_NAME_LEFT,
    transform: "rotateY(-90deg) translateZ(%s)",
    color: "#37474f"
}

const right = {
    name: SIDE_NAME_RIGHT,
    transform: "rotateY(90deg) translateZ(%s)",
    color: "#880e4f"
}

const top = {
    name: SIDE_NAME_TOP,
    transform: "rotateX(90deg) translateZ(%s)",
    color: "#4a148c"
}

const bottom = {
    name: SIDE_NAME_BOTTOM,
    transform: "rotate(-90deg) translateZ(%s)",
    color: "#9e9d24"
}

const containerStyles = (container, sizeInPx) => {
    const sizeStr = sizeInPx + "px";
    container
        .style("width", sizeStr)
        .style("height", sizeStr)
        .style("position", "absolute")
        .style("top", "40vh")
        .style("left", "40vw")
        .style("perspective", "800px")
}

const innerStyles = (inner) => {
    inner
        .style("width", "100%")
        .style("height", "100%")
        .style("position", "absolute")
        .style("transform-style", "preserve-3d")
}

const create = (containerSelector, sizeInPx) => {
    const sides = [front, back, top, bottom, left, right];

    const container = d3.selectAll(containerSelector);
    const inner = container
        .append("div")
        .attr("class", "_cube animate-cube")

    inner.selectAll("div.cube-side")
        .data(sides)
        .enter()
        .append("div")
        .attr("class", (d) => "cube-side " + d.name)
        .style("border", "1px solid black")
        .style("width", "100%")
        .style("height", "100%")
        .style("position", "absolute")
        .style("margin", 0)
        .style("display", "block")
        .style("transform", (d) => vsprintf(d.transform, [(sizeInPx/2) + "px"]))

    containerStyles(container, sizeInPx);
    innerStyles(inner);
}

export const cube = {
    create
}