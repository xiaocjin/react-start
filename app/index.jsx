import React from 'react'
import ReactDOM from 'react-dom'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './stores'

let store = configureStore();

const history = syncHistoryWithStore(hashHistory, store)

import Root from './containers/Root';

ReactDOM.render(
    <Root store={store} history={history}/>,
    document.getElementById('app')
);