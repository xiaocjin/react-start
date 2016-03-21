/**
 * Created by jinxc on 15/11/24.
 */
import React from 'react'
import { Route, Link , IndexRoute } from 'react-router';

import 'antd/lib/index.css';
import '../styles/custom.scss';
var Menu = require('./menu/menu.js');
import Nav from './nav/navigation.js';

let Qxjx = React.createClass({
    getInitialState(){
        return {
            user: {
                realName: ''
            },
            menu: []
        };
    },
    componentDidMount(){
        this.setState({
            user: {realName: 'jinxc'},
            menu: [{
                "title": "学校管理",
                type: 1,
                "nodes": [{"title": "基础信息", link: "school/info"}]
            }]
        });
    },
    render() {
        return (
            <div className="container">
                <div>
                    <Menu title={this.state.user.realName || '' } headIcon={this.props.headIcon}
                          items={this.state.menu}/>
                    <Nav {...this.state.user} />

                    <div className="right_col" role="main" style={{ 'minHeight': '800px'}}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
});

import School from '../containers/school';
//var Subject = require('./school/subject/subject');
//var Grade = require('./school/grade/grade');
//var Cls = require('./school/cls/cls');
//var Version = require('./version/version');
//var Notice = require('./notice/notice');
//var Type = require('./resource/type/type');
//var Question = require('./resource/question/question');
//var Exercise = require('./resource/exercise/exercise');
//var User = require('./user/user');
//var Activity = require('./activity/activity');
//var Task = require('./activity/task');


var Home = React.createClass({
    render: function () {
        return (<div></div>);
    }
});


let router = (
    <Route path="/" component={Qxjx}>
        <IndexRoute component={Home}/>
        <Route path="school">
            <Route path="info" component={School}/>
        </Route>
    </Route>
);

export default router;
