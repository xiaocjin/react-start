import { combineReducers } from 'redux'
import school from './school.js'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
    school,
    routing: routerReducer
});

export default rootReducer
