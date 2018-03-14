import $ from 'jquery';

import {log} from '../util/log';
import * as fct from '../util/fct';
import {appendScriptsWithReadyFunction} from '../util/loadScript';
import {slideControl} from './control/SlideControl';
import {appendStyles} from "../util/loadStyles";
import {loadHtml} from '../util/loadHtml';

const clearHtml = (slideId) => {
    $("#" + slideId).empty();
}

export const htmlSlide = (slideId, config) => {
    return new Promise((resolve) => {
        config.scriptThingyArray = config.scriptThingyArray || [];
        config.pathToJsArray = config.pathToJsArray || [];

        appendStyles(config.pathToCssArray);
        loadHtml(slideId, config.pathToHtml);

        appendScriptsWithReadyFunction([...config.pathToJsArray, ...config.scriptThingyArray], config.readyFunction, "final").then(() => {
            log.info("ready: " + slideId);
            slideControl.registerConfig(slideId, config);
            fct.call(config.startFunction);
            resolve();
        })
    })
}

export class HtmlSlide {

    constructor(slideId, config) {
        this.slideId = slideId;
        this.config = config;

        this.startedPromise = htmlSlide(slideId, config);
    }

    getStartedPromise() {
        return this.startedPromise;
    }

    setPause(pauseIsOn) {
        this.pauseIsOn = pauseIsOn;
    }

    setReloadInterval(ms) {
        this.reloadInterval = setInterval(() => {
            this.reload();
        }, ms);
    }

    clearReloadInterval() {
        clearInterval(this.reloadInterval);
    }

    setResetInterval(ms) {
        this.resetInterval = setInterval(() => {
            this.reset();
        }, ms);
    }

    clearResetInterval() {
        clearInterval(this.resetInterval);
    }

    reset() {
        this.startedPromise.then(() => {
            fct.call(this.config.resetFunction);
        })
    }

    reload() {
        this.startedPromise.then(() => {
            clearHtml(this.slideId);
            loadHtml(this.slideId, this.config.pathToHtml);
            fct.call(this.config.startFunction);
        })
    }
}
