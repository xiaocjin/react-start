import { REQUEST_SCHOOL_INFO, RECEIVE_SCHOOL_INFO } from '../actions/school.js'
import merge from 'lodash/object/merge'
import union from 'lodash/array/union'
import assign from 'lodash/object/assign'

const initialState =
{
  id: 0,
  schoolName: 'ces1',
  introduction: 'ces2'
}


export default function schools(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_SCHOOL_INFO:
      console.log(REQUEST_SCHOOL_INFO, action, state);
      return state

    case RECEIVE_SCHOOL_INFO:
      console.log(RECEIVE_SCHOOL_INFO, action, state);
      if (action.data) {
        const sc = action.data;
        const obj = {
          id: sc.data.id,
          schoolName: sc.data.schoolName,
          introduction: sc.data.introduction
        }
        console.log(obj)
        return obj
      }
      return state

    default:
      return state
  }
}
