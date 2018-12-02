import {
    ICO_DETAILS,
    ICO_LIST,
} from './actions';

let defaultState = {
    ICO: {
        details: {},
        load: false,
    },
    ICOs: {
        list: [],
        load: false,
        pagination: {}
    },
};

export default function icos(state = defaultState, action) {
    switch (action.type) {
        case ICO_DETAILS:
            return Object.assign({}, state, {
                ICO:{...state.ICO, ...action.body}
            });
            break;

        case ICO_LIST:
            return Object.assign({}, state, {
                ICOs:{...state.ICOs, ...action.body}
            });
            break;

        default:
            return state;
    }
}