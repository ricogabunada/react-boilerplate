import {
    COIN_COMP_PHASE_DETAILS,
    COIN_COMP_PHASE_LIST,
} from './actions';

let defaultState = {
    coinCompPhase: {
        details: {},
        load: false,
    },
    coinCompPhases: {
        list: [],
        load: false,
        pagination: {},
    },
};

export default function coinCompPhases(state = defaultState, action) {
    switch (action.type) {
        case COIN_COMP_PHASE_DETAILS:
            return Object.assign({}, state, {
                coinCompPhase: {...state.coinCompPhase, ...action.body}
            });
            break;

        case COIN_COMP_PHASE_LIST:
            return Object.assign({}, state, {
                coinCompPhases: {...state.coinCompPhases, ...action.body}
            });
            break;

        default:
            return state;
    }
}