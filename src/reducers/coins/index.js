import {
    COIN_LIST,
    COIN_DETAILS,
} from './actions';

let defaultState = {
    coin: {
        details: {},
        load: false
    },
    coins: {
        list: [],
        load: false,
        pagination: {},
    }
};

export default function coins(state = defaultState, action) {
    switch (action.type) {
        case COIN_LIST:
            return Object.assign({}, state, {
                coins: {...state.coins, ...action.body}
            });
            break;

        case COIN_DETAILS:
            return Object.assign({}, state, {
                coin: {...state.coin, ...action.body}
            });
            break;

        default:
            return state;
    }
}