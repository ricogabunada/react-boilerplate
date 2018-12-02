import resources from './resources';

export const COIN_TRANSACTION_SETTING_DETAILS = 'COIN_TRANSACTION_SETTING_DETAILS';
export const COIN_TRANSACTION_SETTING_LIST = 'COIN_TRANSACTION_SETTING_LIST';
export const SAVE_AS_NEW_TRANSACTION = 'SAVE_AS_NEW_TRANSACTION';

export function setCoinTransactionSettingDetails(body) {
	return dispatch => {
		dispatch({
			type: COIN_TRANSACTION_SETTING_DETAILS,
			body,
		});
	};
}

export function setCoinTransactionSettingList(body) {
	return dispatch => {
		dispatch({
			type: COIN_TRANSACTION_SETTING_LIST,
			body,
		});
	};
}

export function setSaveAsNewTransaction(body) {
	return dispatch => {
		dispatch({
			type: SAVE_AS_NEW_TRANSACTION,
			body,
		});
	};
}
