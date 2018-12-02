import resources from './resources';

export const COIN_COMP_PARTICIPANT_DETAILS = 'COIN_COMP_PARTICIPANT_DETAILS';
export const COIN_COMP_PARTICIPANT_LIST = 'COIN_COMP_PARTICIPANT_LIST';

export function setCoinCompParticipantDetails(body) {
	return dispatch => {
		dispatch({
			type: COIN_COMP_PARTICIPANT_DETAILS,
			body,
		});
	};
}

export function setCoinCompParticipantList(body) {
	console.log('setCoinCompParticipantList', body);
	return dispatch => {
		dispatch({
			type: COIN_COMP_PARTICIPANT_LIST,
			body,
		});
	};
}