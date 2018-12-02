import {
    COIN_TRANSACTION_SETTING_DETAILS,
    COIN_TRANSACTION_SETTING_LIST,
	SAVE_AS_NEW_TRANSACTION,
} from './actions';

let defaultState = {
    coinTransactionSetting: {
        details: {},
        load: false,
        saveAsNew: false,
    },
    coinTransactionSettings: {
        list: [],
        load: false,
        pagination: {},
    },
	saveAsNewTransaction: false,
};

export default function coinTransactionSettings(state = defaultState, action) {
    switch (action.type) {
        case COIN_TRANSACTION_SETTING_DETAILS:
            return Object.assign({}, state, {
                coinTransactionSetting: {...state.coinTransactionSetting, ...action.body}
            });
            break;

        case COIN_TRANSACTION_SETTING_LIST:
            return Object.assign({}, state, {
                coinTransactionSettings: {...state.coinTransactionSettings, ...action.body}
            });
            break;

        case SAVE_AS_NEW_TRANSACTION:
            return Object.assign({}, state, {
                saveAsNewTransaction: action.body,
            });
            break;

        default:
            return state;
    }
}
