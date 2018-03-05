export const init = (selector, hud) => {
    const hudContainer = document.querySelector(selector);
    hud.hudElements[0].appendChild(hudContainer);
}