import { REDUX_ACTIONS } from "../actions";

export function reducer(
    preState: Array<string>,
    action: {
        type: REDUX_ACTIONS;
        payload: Array<string>;
    }
): Array<string> {
    switch (action.type) {
        case REDUX_ACTIONS.ALL_CATEGORIES_UPDATE:
            return action.payload;
    }
    if (preState) return preState;
    return [];
}