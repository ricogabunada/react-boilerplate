export const ICO_TRANCHE_DETAILS = 'ICO_TRANCHE_DETAILS';
export const ICO_TRANCHE_LIST = 'ICO_TRANCHE_LIST';

export function setICOTrancheDetails(body) {
	return dispatch => {
		dispatch({
			type: ICO_TRANCHE_DETAILS,
			body,
		});
	};
}

export function setICOTrancheList(body) {
	return dispatch => {
		dispatch({
			type: ICO_TRANCHE_LIST,
			body,
		});
	};
}