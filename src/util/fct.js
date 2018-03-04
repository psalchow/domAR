import * as _ from 'lodash';

export const call = (fct) => {
    if(_.isFunction(fct)) {
        return fct();
    }
}

export const callWithPromise = (fct) => {
    if(_.isFunction(fct)) {
        return fct();
    }
    else {
        return Promise.resolve();
    }
}

export const isFunction = (fct) => {
    return _.isFunction(fct);
}
