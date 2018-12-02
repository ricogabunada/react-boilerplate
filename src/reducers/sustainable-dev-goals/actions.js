import resources from './resources';

export const SUSTAINABLE_DEV_GOAL_LIST = 'SUSTAINABLE_DEV_GOAL_LIST';
export const SUSTAINABLE_DEV_GOAL_DETAILS = 'SUSTAINABLE_DEV_GOAL_DETAILS';

export function setSustainableDevGoalList(body) {
	return dispatch => {
		dispatch({
			type: SUSTAINABLE_DEV_GOAL_LIST,
			body,
		});
	};
}

export function setSustainableDevGoalDetails(body) {
	return dispatch => {
		dispatch({
			type: SUSTAINABLE_DEV_GOAL_DETAILS,
			body,
		});
	};
}