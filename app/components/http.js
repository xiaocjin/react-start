/**
 * Created by jinxc on 15/12/24.
 */
import fetch from 'isomorphic-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

export function getData(url) {
  fetch(url, {
    credentials: 'include'
  }).then(checkStatus)
    .then(function (data) {
      console.log('request succeeded with JSON response', data);
      return {
        type: 1,
        data
      }
    }).catch(function (error) {
      return {
        type: 0,
        error
      }
    })

}

export function getJsonData(url) {
  fetch(url, {
    credentials: 'include'
  }).then(checkStatus)
    .then(parseJSON)
    .then(function (data) {
      console.log('request succeeded with JSON response', data);
      return {
        type: 1,
        data
      }
    }).catch(function (error) {
      return {
        type: 0,
        error
      }
    })
}

export function postJsonData(url, obj) {
  fetch(url, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  }).then(checkStatus)
    .then(parseJSON)
    .then(function (data) {
      console.log('request succeeded with JSON response', data);
      return {
        type: 1,
        data
      }
    }).catch(function (error) {
      return {
        type: 0,
        error
      }
    })
}

export function postFormData(url, form) {
  fetch(url, {
    method: 'post',
    body: new FormData(form)
  }).then(checkStatus)
    .then(parseJSON)
    .then(function (data) {
      console.log('request succeeded with JSON response', data);
      return {
        type: 1,
        data
      }
    }).catch(function (error) {
      return {
        type: 0,
        error
      }
    })
}

export default {
  getData,
  getJsonData,
  postJsonData,
  postFormData
}
