import { SET_CATEGORIES } from '../actions/types'
import _ from 'lodash';
const initiaState = {
    categories:[],
    pagination:{
        count:'',
        limit:'',
        skip:''
    }
};

export default function (state = initiaState, action) {
    switch (action.type) {
        case SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload.body,
                pagination: action.payload.pagination
            };
        default:
            return state;

    }
}