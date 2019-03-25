import { SET_CURRENT_USER } from '../actions/types'
import _ from 'lodash';
const initiaState = {
    isAuthanticated: false,
}

export default function (state = initiaState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthanticated: !_.isEmpty(action.payload),
            };
        default:
            return state;

    }
}