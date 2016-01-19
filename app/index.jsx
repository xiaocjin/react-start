import React from 'react';
import { render } from 'react-dom'
import router from './components/route.js'
import { Provider } from 'react-redux';
import configureStore from './stores/configureStore'
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter } from 'redux-simple-router';
import { Router } from 'react-router';

const store = configureStore();
const history = createBrowserHistory();
syncReduxAndRouter(history, store);

render(
    <Provider store={store}>
        <div>
            <Router history={history}>
                {router}
            </Router>
        </div>
    </Provider>,
    document.getElementById('app'));