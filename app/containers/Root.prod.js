/**
 * Created by jinxc on 16/3/21.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router'
import router from '../components/route.js'

export default class Root extends Component {
    render() {
        let { store,history } = this.props;
        return (
            <Provider store={store}>
                <div>
                    <Router history={history}>
                        {router}
                    </Router>
                </div>
            </Provider>
        );
    }
}
