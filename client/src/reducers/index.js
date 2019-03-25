import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorsReducer from './errorReducer';
import  categoryReducer from './categoryReducer';


export default combineReducers({
    auth: authReducer,
    errors: errorsReducer,
    category: categoryReducer
})