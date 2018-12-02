import resources from './resources';

export const COIN_COMP_PHASE_DETAILS = 'COIN_COMP_PHASE_DETAILS';
export const COIN_COMP_PHASE_LIST = 'COIN_COMP_PHASE_LIST';

export function setCoinCompPhaseDetails(body) {
	return dispatch => {
		dispatch({
			type: COIN_COMP_PHASE_DETAILS,
			body,
		});
	};
}

export function setCoinCompPhaseList(body) {
	return dispatch => {
		dispatch({
			type: COIN_COMP_PHASE_LIST,
			body,
		});
	};
}