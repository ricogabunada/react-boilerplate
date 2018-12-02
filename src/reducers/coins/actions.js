import resources from './resources';

export const COIN_LIST = 'COIN_LIST';
export const COIN_DETAILS = 'COIN_DETAILS';

export function setCoinList(body) {
	return dispatch => {
		dispatch({
			type: COIN_LIST,
			body,
		});
	};
}

export function setCoinDetails(body) {
	return dispatch => {
		dispatch({
			type: COIN_DETAILS,
			body,
		});
	};
}