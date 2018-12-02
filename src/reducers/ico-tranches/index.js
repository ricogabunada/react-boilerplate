import {
    ICO_TRANCHE_LIST,
    ICO_TRANCHE_DETAILS
} from './actions';

let defaultState = {
    ICOTranche: {
        details: {},
        load: false,
    },
    ICOTranches: {
        list: [],
        load: false,
        pagination: {}
    },
};

export default function ICOTranches(state = defaultState, action) {
    switch (action.type) {
        case ICO_TRANCHE_DETAILS:
            return Object.assign({}, state, {
                ICOTranche:{...state.ICOTranche, ...action.body}
            });
            break;

        case ICO_TRANCHE_LIST:
            return Object.assign({}, state, {
                ICOTranches:{...state.ICOTranches, ...action.body}
            });
            break;

        default:
            return state;
    }
}

