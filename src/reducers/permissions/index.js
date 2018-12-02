import {
	CURRENT_PAGE_NUMBER,
} from './actions';

let defaultState = {
	currentPageNumber: 1,
};

export default function permissions(state = defaultState, action) {
	switch (action.type) {
		case CURRENT_PAGE_NUMBER:
			return Object.assign({}, state, {
				currentPageNumber: action.body,
			});
		default:
			return state;
	}
}

