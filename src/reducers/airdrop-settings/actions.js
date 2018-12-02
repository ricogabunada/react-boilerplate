import resources from './resources';

export const COIN_COMP_SETTING_DETAILS = 'COIN_COMP_SETTING_DETAILS';
export const COIN_COMP_SETTING_LIST = 'COIN_COMP_SETTING_LIST';

export function setCoinCompSettingDetails(body) {
	return dispatch => {
		dispatch({
			type: COIN_COMP_SETTING_DETAILS,
			body,
		});
	};
}

export function setCoinCompSettingList(body) {
	return dispatch => {
		dispatch({
			type: COIN_COMP_SETTING_LIST,
			body,
		});
	};
}