import {
    SUSTAINABLE_DEV_GOAL_LIST,
    SUSTAINABLE_DEV_GOAL_DETAILS,
} from './actions';

let defaultState = {
    sustainableDevGoal: {
        details: {},
        load: false
    },
    sustainableDevGoals: {
        list: [],
        load: false,
        pagination: {},
    }
};

export default function sustainableDevGoals(state = defaultState, action) {
    switch (action.type) {
        case SUSTAINABLE_DEV_GOAL_LIST:
            return Object.assign({}, state, {
                sustainableDevGoals: {...state.sustainableDevGoals, ...action.body}
            });
            break;

        case SUSTAINABLE_DEV_GOAL_DETAILS:
            return Object.assign({}, state, {
                sustainableDevGoal: {...state.sustainableDevGoal, ...action.body}
            });
            break;

        default:
            return state;
    }
}