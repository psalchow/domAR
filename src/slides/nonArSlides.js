import * as _ from 'lodash';

import {createQueryMap, createHrefWithQueryMap} from '../util/query';

export const nextSlide = (newSlideId) => {
    const queryMap = createQueryMap();
    if(!_.isEmpty(queryMap.slide) || !_.isEmpty(queryMap.nonar)) {
        queryMap.slide = newSlideId;
        delete queryMap.nonar;
    }
    const href = createHrefWithQueryMap(queryMap);

    window.location.href = href;
}
