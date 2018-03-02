import * as _ from 'lodash';

import {log} from '../util/log';
import {setArPositionRotation, TYPE_RING} from '../ar/arPositions';
import {init} from '../ar/argonApp';
import {CommandHub} from './control/commandHub';
import {slideControl} from './control/SlideControl';
import * as key from './slidAR/key';
import * as query from '../util/query';
import * as slidAR from './slidAR/slidAR';
import {slidarGlobal} from './slidAR/slidarGlobal';
import * as steps from './slidAR/steps';

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

export const initSlides = async (rootSelector, slideCreateFunction, param) => {
    key.init();
    new CommandHub();

    const selectedFilename = query.paramValue("slide");
    const type = query.paramValue("type");

    if(_.isEmpty(selectedFilename)) {
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
        slideCreateFunction(rootSelector, selectedFilename).then(() => steps.init());
    }
}
