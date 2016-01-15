import { combineReducers } from 'redux'
import school from './school.js'
import { routeReducer } from 'redux-simple-router'

const rootReducer = combineReducers({
  routing: routeReducer,
  school
});

export default rootReducer
