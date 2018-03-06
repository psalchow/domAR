import * as d3 from 'd3';

export const addLeftRightButtons = (hudSelector, onLeftClick, onRightClick) => {
    const menu = d3.selectAll(hudSelector)
        .append("div")
        .attr("class", "menu")

    addHudButton(menu, "lefthud", "keyboard_arrow_left", onLeftClick);
    addHudButton(menu, "righthud", "keyboard_arrow_right", onRightClick);
}

export const addHudButton = (parent, classname, materialIcon, onClick) => {
    const button = parent.append("button")
        .attr("class", classname)
        .on("click", onClick)

    button.append("i")
        .attr("class", "material-icons")
        .text(materialIcon)
}

export const init = (selector, hud) => {
    const hudContainer = document.querySelector(selector);
    hud.hudElements[0].appendChild(hudContainer);
}
