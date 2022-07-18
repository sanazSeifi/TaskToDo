import { REDUX_ACTIONS } from "../actions";

export function reducer(
    preState: string,
    action: {
        type: REDUX_ACTIONS;
        payload: string;
    }
): string {
    switch (action.type) {
        case REDUX_ACTIONS.ACTIVE_CATEGORY_UPDATE:
            return action.payload;
    }
    if (preState) return preState;
    return '';
}