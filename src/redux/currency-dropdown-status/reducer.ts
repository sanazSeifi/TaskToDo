import { REDUX_ACTIONS } from "../actions";

export function reducer(
    preState: boolean,
    action: {
        type: REDUX_ACTIONS;
        payload: boolean;
    }
): boolean {
    switch (action.type) {
        case REDUX_ACTIONS.CURRENCY_DROPDOWN_STATUS_TOGGLE:
            return action.payload;
    }
    if (preState) return preState;
    return false;
}