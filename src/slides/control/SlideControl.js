import * as _ from 'lodash';
import * as $ from 'jquery';

import {log} from '../../util/log';
import * as fct from '../../util/fct';
import {slidarGlobal} from '../slidAR/slidarGlobal';
import * as nonArSlides from '../nonArSlides';

import * as arTransform from '../../ar/arTransform';

/* eslint eqeqeq: "off" */
class SlideControl {

    constructor(withAr) {
        this.configs = {};
        this.steps = {};
        this.slideIds = [];
    }

    setTWEEN(TWEEN) {
        this.TWEEN = TWEEN;
    }

    getNumberOfSlides() {
        return this.slideIds.length;
    }

    getSlideIds() {
        return this.slideIds;
    }

    _waitForAllSteps = (resolve) => {
        if(this.getNumberOfSteps() < this.getNumberOfSlides()) {
            setTimeout(() => this._waitForAllSteps(resolve), 100);
        }
        else {
            setTimeout(() => resolve(), 100);
        }
    }

    waitForAllSteps() {
        return new Promise((resolve) => {
            this._waitForAllSteps(resolve);
        })
    }

    registerConfig(slideId, config) {
        log.info("registered: " + slideId);
        log.info(config);
        this.configs[slideId] = config;
    }

    createAndRegisterConfig(slideId) {
        log.info("created new config for: " + slideId);
        const config = {};
        this.registerConfig(slideId, config);

        return config;
    }

    addObject(slideId, object) {
        log.info("add object to slideId: " + slideId);
        log.info(object);
        const config = this.configs[slideId];
        if(_.isObject(config)) {
            config.object = object;
        }
    }

    getAllObjects() {
        const allObjects = _.map(this.configs, 'object');
        return allObjects;
    }

    doForAll(fctName) {
        _.forOwn(this.configs, (config) => {
            SlideControl.doForOneWithConfig(config, fctName);
        })
    }

    doForOneWithSlideId(slideId, fctName) {
        const config = this.configs[slideId];
        SlideControl.doForOneWithConfig(config, fctName);
    }

    static doForOneWithConfig(config, fctName) {
        if(!_.isEmpty(config)) {
            const configFct = config[fctName];
            if(fct.isFunction(configFct)) {
                configFct();
            }
        }
    }

    doForOneOrForAll(param, fctName) {
        if(param === ":all") {
            this.doForAll(fctName);
        }
        else {
            this.doForOneWithSlideId(param, fctName);
        }
    }

    pauseJs(param) {
        this.doForOneOrForAll(param, "pauseFunction");
    }

    resumeJs(param) {
        this.doForOneOrForAll(param, "resumeFunction");
    }

    nextSlide() {
        if(slidarGlobal.withAr) {
            const allObjects = this.getAllObjects();
            arTransform.allNext(allObjects, this.TWEEN);
            this.shiftForwardCurrentSlideId();
        }
        else {
            this.shiftForwardCurrentSlideId();
            nonArSlides.nextSlide(this.currentSlideId);
        }
    }

    gotoSlide(slideId) {
        if(slideId != this.currentSlideId) {
            this.setCurrentSlideId(slideId);
            if(!slidarGlobal.withAr) {
                nonArSlides.nextSlide(slideId);
            }
        }
    }

    fwdSlide(sendStatusFunction) {
        if(slidarGlobal.withAr) {
            const allObjects = this.getAllObjects();
            arTransform.allFwd(allObjects, this.TWEEN);
            this.shiftForwardCurrentSlideId();
            fct.call(sendStatusFunction);
        }
        else {
            this.shiftForwardCurrentSlideId();
            fct.callWithPromise(sendStatusFunction).then(() => {
                nonArSlides.nextSlide(this.currentSlideId);
            });
        }
    }

    backSlide(sendStatusFunction) {
        if(slidarGlobal.withAr) {
            const allObjects = this.getAllObjects();
            arTransform.allBack(allObjects, this.TWEEN);
            this.shiftBackwardCurrentSlideId();
            fct.call(sendStatusFunction);
        }
        else {
            this.shiftBackwardCurrentSlideId();
            fct.callWithPromise(sendStatusFunction).then(() => {
                nonArSlides.nextSlide(this.currentSlideId);
            })
        }
    }

    setCurrentSlideId(slideId) {
        this.currentSlideId = slideId;
    }

    addSlideId(slideId) {
        this.slideIds.push(slideId);
        this.steps[slideId] = {stepNumber: 0};
    }

    shiftForwardCurrentSlideId() {
        const currentIndex = this.slideIds.indexOf(this.currentSlideId);
        const nextIndex = currentIndex >= this.slideIds.length - 1 ? 0 : currentIndex+1;
        this.currentSlideId = this.slideIds[nextIndex];
    }

    shiftBackwardCurrentSlideId() {
        const currentIndex = this.slideIds.indexOf(this.currentSlideId);
        const nextIndex = currentIndex <= 0 ? this.slideIds.length - 1 : currentIndex-1;
        this.currentSlideId = this.slideIds[nextIndex];
    }

    setStepsObject(slideId, steps, stepNumber = 0) {
        this.steps[slideId] = {steps, stepNumber};
    }

    getStepsObject = (slideId) => {
        return this.steps[slideId];
    }

    getNumberOfSteps() {
        return this.steps.length;
    }

    setCurrentStepsObject(steps, stepNumber = 0) {
        this.setStepsObject(this.currentSlideId, steps, stepNumber);
    }

    getCurrentStepsObject() {
        return this.getStepsObject(this.currentSlideId);
    }

    getCurrentSlideId() {
        return this.currentSlideId;
    }

    renderStepNumberForSlideId(slideId) {
        const renderCounterElement = $("#" + slideId + " .slidecounter");
        if(!_.isEmpty(renderCounterElement)) {
            const {steps, stepNumber} = this.getStepsObject(slideId);
            renderCounterElement.html(stepNumber + " / " + steps.length);
        }
    }

    renderStepNumber() {
        this.renderStepNumberForSlideId(this.currentSlideId);
    }

    incStepNumber(slideId) {
        const {steps, stepNumber} = this.getStepsObject(slideId);
        const newStepNumber = stepNumber+1;
        this.setStepsObject(slideId, steps, newStepNumber);
        this.renderStepNumberForSlideId(slideId);

        return newStepNumber;
    }

    incCurrentStepNumber() {
        return this.incStepNumber(this.currentSlideId);
    }

    decStepNumber(slideId) {
        const {steps, stepNumber} = this.getStepsObject(slideId);
        const newStepNumber = stepNumber-1;
        this.setStepsObject(slideId, steps, newStepNumber);
        this.renderStepNumberForSlideId(slideId);

        return newStepNumber;
    }

    decCurrentStepNumber() {
        return this.decStepNumber(this.currentSlideId);
    }

    _gotoStep(slideId, toStepNumber, resolve) {
        const fromStepNumber = this.getStepsObject(slideId).stepNumber;
        if(fromStepNumber == toStepNumber) {
            resolve();
        }
        else {
            if(toStepNumber > fromStepNumber) {
                this.forwardStepOnSlideId(slideId);
                setTimeout(() => this._gotoStep(slideId, toStepNumber, resolve), 100);
            }
            else {
                this.backwardStepOnSlideId(slideId);
                setTimeout(() => this._gotoStep(slideId, toStepNumber, resolve), 100)
            }
        }
    }

    async gotoStep(slideId, toStepNumber) {
        await this.waitForAllSteps();
        return new Promise((resolve) => {
            this._gotoStep(slideId, toStepNumber, resolve);
        })
    }

    gotoStepOnCurrentSlide(toStepNumber) {
        return this.gotoStep(this.currentSlideId, toStepNumber);
    }

    forwardStepOnSlideId(slideId) {
        const {steps, stepNumber} = this.getStepsObject(slideId);
        if(_.isEmpty(steps)) {
            return
        }
        if(stepNumber < steps.length) {
            const step = steps[stepNumber];
            fct.call(step.f);
            this.incStepNumber(slideId);
        }
    }

    forwardStep() {
        this.forwardStepOnSlideId(this.currentSlideId);
    }

    _stepFwd(numberOfSteps) {
        if(numberOfSteps > 0) {
            this.forwardStep();
            setTimeout(() => this._stepFwd(numberOfSteps-1), 10);
        }
    }

    _stepBack(numberOfSteps) {
        if(numberOfSteps > 0) {
            this.backwardStep();
            setTimeout(() => this._stepBack(numberOfSteps-1), 10);
        }
    }

    async gotoLastStep() {
        await this.waitForAllSteps();
        const {steps} = this.getCurrentStepsObject();
        if(_.isEmpty(steps)) {
            return
        }
        return this.gotoStepOnCurrentSlide(steps.length-1);
    }

    gotoFirstStep() {
        return this.gotoStepOnCurrentSlide(0);
    }

    backwardStepOnSlideId(slideId) {
        const {steps, stepNumber} = this.getStepsObject(slideId);
        if(_.isEmpty(steps) || !(stepNumber > 0)) {
            return
        }
        const newstepNumber = this.decStepNumber(slideId);
        const step = steps[newstepNumber];
        fct.call(step.b);
    }

    backwardStep() {
        const {steps, stepNumber} = this.getCurrentStepsObject();
        if(_.isEmpty(steps) || !(stepNumber > 0)) {
            return
        }
        const newstepNumber = this.decCurrentStepNumber();
        const step = steps[newstepNumber];
        fct.call(step.b);
    }
}

export const slideControl = new SlideControl();
