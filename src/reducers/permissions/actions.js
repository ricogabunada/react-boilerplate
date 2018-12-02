import resources from './resources';

export const CURRENT_PAGE_NUMBER = 'CURRENT_PAGE_NUMBER';

export function setCurrentPageNumber(body) {
	return dispatch => {
		dispatch({
			type: CURRENT_PAGE_NUMBER,
			body,
		});
	};
}
