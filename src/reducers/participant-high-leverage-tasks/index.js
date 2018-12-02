import {
    PARTICIPANT_TASK_LIST,
} from './actions';

let defaultState = {
    participantTaskList: {
        list: [],
        load: false,
        pagination: {}
    },
};

export default function participantTaskLists(state = defaultState, action) {
    switch (action.type) {
        case PARTICIPANT_TASK_LIST:
            return Object.assign({}, state, {
                participantTaskList:{...state.participantTaskList, ...action.body}
            });
            break;

        default:
            return state;
    }
}