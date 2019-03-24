import { SET_CURRENT_USER } from '../actions/types'
import _ from 'lodash';
const initiaState = {
    isAuthanticated: false,
    user: {}
}

export default function (state = initiaState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthanticated: !_.isEmpty(action.payload),
                user: {
                    ...action.payload
                }
            };
        default:
            return state;

    }
}