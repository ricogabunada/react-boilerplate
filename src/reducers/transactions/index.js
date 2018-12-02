import {
    TRANSACTION_LIST,
    TRANSACTION_DETAILS
} from './actions';

let defaultState = {
    transaction: {
        details: {},
        load: false,
        options: {},
    },
    transactions: {
        list: [],
        load: false,
        pagination: {}
    },
};

export default function transactions(state = defaultState, action) {
    switch (action.type) {
        case TRANSACTION_DETAILS:
            return Object.assign({}, state, {
                transaction: {...state.transaction, ...action.body}
            });
            break;

        case TRANSACTION_LIST:
            return Object.assign({}, state, {
                transactions: {...state.transactions, ...action.body}
            });
            break;

        default:
            return state;
    }
}