export const TRANSACTION_LIST = 'TRANSACTION_LIST';
export const TRANSACTION_DETAILS = 'TRANSACTION_DETAILS';

export function setTransactionDetails(body) {
	return dispatch => {
		dispatch({
			type: TRANSACTION_DETAILS,
			body,
		});
	};
}

export function setTransactionList(body) {
	return dispatch => {
		dispatch({
			type: TRANSACTION_LIST,
			body,
        });
    }
}
	