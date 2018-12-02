export const HIGH_LEVERAGE_TASK_LIST = 'HIGH_LEVERAGE_TASK_LIST';
export const HIGH_LEVERAGE_TASK_DETAILS = 'HIGH_LEVERAGE_TASK_DETAILS';
export const HIGH_LEVERAGE_TASK_NEW_DESCRIPTION = 'HIGH_LEVERAGE_TASK_NEW_DESCRIPTION';

export function setHighLeverageTaskList(body) {
    return dispatch => {
        dispatch({
            type: HIGH_LEVERAGE_TASK_LIST,
            body,
        });
    }
}

export function setHighLeverageTaskDetails(body) {
    return dispatch => {
        dispatch({
            type: HIGH_LEVERAGE_TASK_DETAILS,
            body,
        });
    }
}

export function setHighLeverageTaskNewDescription(body) {
    return dispatch => {
        dispatch({
            type: HIGH_LEVERAGE_TASK_NEW_DESCRIPTION,
            body,
        });
    }
}