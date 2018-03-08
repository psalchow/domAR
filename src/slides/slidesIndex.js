import * as _ from 'lodash';

import {log} from '../util/log';
import {setArPositionRotation, TYPE_RING} from '../ar/arPositions';
import {init} from '../ar/argonApp';
import {CommandHub, connect} from './control/commandHub';
import {executeCommand, COMMAND_INIT} from './control/commandExecutor';
import {slideControl} from './control/SlideControl';
import * as key from './slidAR/key';
import * as query from '../util/query';
import * as slidAR from './slidAR/slidAR';
import {slidarGlobal} from './slidAR/slidarGlobal';
import * as steps from './slidAR/steps';
import * as hudUtil from "../ar/hudUtil";

window.slidAR = slidAR;

const TWEEN = require('@tweenjs/tween.js');
slideControl.setTWEEN(TWEEN);

const startSlideShow = (slideShowIntervalInSeconds) => {
    if(slideShowIntervalInSeconds > 0) {
        setInterval(() => {
            slideControl.nextSlide();
        }, slideShowIntervalInSeconds * 1000);
    }
}

const checkIfMaster = () => {
    const master = query.paramValue("master");
    slidarGlobal.isMaster = !_.isUndefined(master);
}

const addHudButtons = () => {
    const onLeftClick = () => slideControl.moveOffsetOnAllSlides(+10);
    const onRightClick = () => slideControl.moveOffsetOnAllSlides(-10);

    hudUtil.addLeftRightButtons("#_hud", onLeftClick, onRightClick);
}

export const initSlides = async (rootSelector, slideCreateFunction, param) => {
    key.init();
    connect();

    const selectedFilename = query.paramValue("slide");
    const nonar = query.paramValue("nonar");
    const type = query.paramValue("type");
    checkIfMaster();

    if(_.isEmpty(selectedFilename) && _.isEmpty(nonar)) {
        slidarGlobal.withAr = true;
        const slideShowIntervalInSeconds = param;
        const {root, app} = init();

        app.updateEvent.on(() => {
            TWEEN.update();
        });

        const selection = await slideCreateFunction(rootSelector);
        log.info("demo slides ready")
        selection.each(function (id, i) {
            const object = setArPositionRotation(this, root, type || TYPE_RING, i, selection.size());
            slideControl.addObject(id, object);
        });

        startSlideShow(slideShowIntervalInSeconds);
    }
    else {
        slidarGlobal.withAr = false;
        if(!_.isEmpty(selectedFilename)) {
            slideControl.setCurrentSlideId(selectedFilename);
            await slideCreateFunction(rootSelector, selectedFilename).then(() => steps.init());
        }
    }

    addHudButtons();

    executeCommand(COMMAND_INIT);
}
