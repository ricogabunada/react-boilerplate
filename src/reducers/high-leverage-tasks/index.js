import {
    HIGH_LEVERAGE_TASK_LIST,
    HIGH_LEVERAGE_TASK_DETAILS,
    HIGH_LEVERAGE_TASK_NEW_DESCRIPTION
} from './actions';

let defaultStates = {
    highLeverageTask: {
        details: {},
        load: false,
        newDescription: '',
    },
    highLeverageTasks: {
        list: [],
        load: false,
        pagination: {}
    }
}

export default function highLeverageTasks(state = defaultStates, action) {
    switch (action.type) {
        case HIGH_LEVERAGE_TASK_LIST:
            return Object.assign({}, state, {
                highLeverageTasks: {...state.highLeverageTasks, ...action.body}
            });
            break;
            
        case HIGH_LEVERAGE_TASK_DETAILS:
            return Object.assign({}, state, {
                highLeverageTask: {...state.highLeverageTask, ...action.body}
            });
            break;

        case HIGH_LEVERAGE_TASK_NEW_DESCRIPTION:
            return Object.assign({}, state, {
                highLeverageTask: {...state.highLeverageTask, newDescription: action.body}
            });
            break;

        default:
            return state;
    }
}