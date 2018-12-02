import resources from './resources';

export const PARTICIPANT_TASK_LIST = 'PARTICIPANT_TASK_LIST';

export function setParticipantTaskList(body) {
	return dispatch => {
		dispatch({
			type: PARTICIPANT_TASK_LIST,
			body,
		});
	};
}