import {
    COIN_COMP_PARTICIPANT_DETAILS,
    COIN_COMP_PARTICIPANT_LIST,
} from './actions';

let defaultState = {
    coinCompParticipant: {
        details: {},
        load: false,
    },
    coinCompParticipants: {
        list: [],
        load: false,
        pagination: {},
        displayAsModal: false,
    },
};

export default function coinCompParticipants(state = defaultState, action) {
    switch (action.type) {
        case COIN_COMP_PARTICIPANT_DETAILS:
            return Object.assign({}, state, {
                coinCompParticipant: {...state.coinCompParticipant, ...action.body}
            });
            break;

        case COIN_COMP_PARTICIPANT_LIST:
            return Object.assign({}, state, {
                coinCompParticipants: {...state.coinCompParticipants, ...action.body}
            });
            break;

        default:
            return state;
    }
}