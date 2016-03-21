/**
 * Created by jinxc on 15/12/24.
 */
import { getJsonData , postJsonData } from '../components/http'
export const GET_INFO = 'GET_SCHOOL_INFO';
export const UPDATE_INFO = 'UPDATE_SCHOOL_INFO';
export const REQUEST_SCHOOL_INFO = 'REQUEST_SCHOOL_INFO'
export const RECEIVE_SCHOOL_INFO = 'RECEIVE_SCHOOL_INFO'

function requestSchoolInfo() {
  return {
    type: REQUEST_SCHOOL_INFO
  }
}

export function receiveSchoolInfo(data, json) {
  console.log(data, json);
  return {
    type: RECEIVE_SCHOOL_INFO,
    data,
    json
  }
}

export function fetchSchoolInfo() {
  return dispatch => {
    const url = '/learn/schoolInfos';
    dispatch(requestSchoolInfo());
    return setTimeout(function () {
      var json = {
        code: 1,
        data: {
          id: 0,
          schoolName: '测试1',
          introduction: '测试2'
        }
      };
      dispatch(receiveSchoolInfo(json));
    }, 1000);
    //return getJsonData(url)
    //  .then(json => dispatch(receiveSchoolInfo(json)))
  }
}

export function postSchoolInfo(data) {
  return dispatch => {
    const url = '/learn/schoolInfos';
    dispatch(requestSchoolInfo());
    return setTimeout(function () {
      var json = {
        code: 1,
        data: {}
      };
      dispatch(receiveSchoolInfo(data, json));
    }, 1000);
    //return postJsonData(url, data)
    //  .then(json => dispatch(receiveSchoolInfo(json, data)))
  }
}


//export function getInfo() {
//  return (dispatch, getState) => {
//    dispatch(fetchSchoolInfo());
//  }
//}
//
//export function updateInfo(info) {
//  return (dispatch, getState) => {
//    dispatch(postSchoolInfo(info));
//  }
//}

