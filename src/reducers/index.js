import availReducer from './availReducer';
import userReducer from './userReducer';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    availReducer : availReducer,
    userReducer : userReducer
});

export default allReducers;
