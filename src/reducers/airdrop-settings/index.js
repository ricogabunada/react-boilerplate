import {
    COIN_COMP_SETTING_DETAILS,
    COIN_COMP_SETTING_LIST,
} from './actions';

let defaultState = {
    coinCompSetting: {
        details: {},
        load: false,
        saveAsNew: false,
    },
    coinCompSettings: {
        list: [],
        load: false,
        pagination: {},
    },
};

export default function coinCompSettings(state = defaultState, action) {
    switch (action.type) {
        case COIN_COMP_SETTING_DETAILS:
            return Object.assign({}, state, {
                coinCompSetting: {...state.coinCompSetting, ...action.body}
            });
            break;

        case COIN_COMP_SETTING_LIST:
            return Object.assign({}, state, {
                coinCompSettings: {...state.coinCompSettings, ...action.body}
            });
            break;

        default:
            return state;
    }
}