import resources from './resources';

export const ICO_DETAILS = 'ICO_DETAILS';
export const ICO_LIST = 'ICO_LIST';

export function setICODetails(body) {
	return dispatch => {
		dispatch({
			type: ICO_DETAILS,
			body,
		});
	};
}

export function setICOList(body) {
	return dispatch => {
		dispatch({
			type: ICO_LIST,
			body,
		});
	};
}