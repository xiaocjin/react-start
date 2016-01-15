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
        "nodes": [{"title": "基础信息", link: "school/info"}, {"title": "学科", link: "school/subject"}, {
          "title": "年级",
          link: "school/grade"
        }, {"title": "班级", link: "school/cls"}]
      }, {
        "title": "用户管理",
        type: 2,
        "nodes": [{"title": "新建用户", link: "user/add"}, {"title": "账号管理", link: "user"}]
      }, {
        "title": "试题管理",
        type: 3,
        "nodes": [{"title": "题目", link: "resource/question"}, {"title": "练习", link: "resource/exercise"}]
      }, {
        "title": "活动单管理",
        type: 4,
        "nodes": [{"title": "我的活动单", link: "activity/my"}, {"title": "批阅活动单", link: "activity/deal"}]
      }, {
        "title": "章节管理",
        type: 6,
        "nodes": [{"title": "章节", link: "resource/type"}]
      }, {
        "title": "公告管理",
        type: 5,
        "nodes": [{"title": "公告栏", link: "notice"}]
      }, {
        "title": "版本管理",
        type: 7,
        "nodes": [{"title": "版本信息", link: "version"}, {"title": "添加版本", link: "version/add"}]
      }]
    });
  },
  render() {
    return (
      <div className="container">
        <div>
          <Menu title={this.state.user.realName || '' } headIcon={this.props.headIcon} items={this.state.menu}/>
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
var Subject = require('./school/subject/subject');
var Grade = require('./school/grade/grade');
var Cls = require('./school/cls/cls');
var Version = require('./version/version');
var Notice = require('./notice/notice');
var Type = require('./resource/type/type');
var Question = require('./resource/question/question');
var Exercise = require('./resource/exercise/exercise');
var User = require('./user/user');
var Activity = require('./activity/activity');
var Task = require('./activity/task');


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
      <Route path="subject">
        <IndexRoute component={Subject.List}/>
        <Route path="add" component={Subject.Add}/>
        <Route path="update/:id" component={Subject.Update}/>
      </Route>
      <Route path="grade">
        <IndexRoute component={Grade.List}/>
      </Route>
      <Route path="cls">
        <IndexRoute component={Cls.List}/>
      </Route>
    </Route>
    <Route path="user">
      <IndexRoute component={User.Index}/>
      <Route path="detail/:id" component={User.Detail}/>
      <Route path="update/:id" component={User.Update}/>
      <Route path="cpw/:id" component={User.Cpw}/>
      <Route path="spw/:id" component={User.Spw}/>
      <Route path="add" component={User.Add}/>
    </Route>
    <Route path="notice">
      <IndexRoute component={Notice.List}/>
      <Route path="add" component={Notice.Add}/>
    </Route>
    <Route path="version">
      <IndexRoute component={Version.List}/>
      <Route path="add" component={Version.Add}/>
    </Route>
    <Route path="resource">
      <IndexRoute component={Home}/>
      <Route path="type">
        <IndexRoute component={Type.List}/>
      </Route>
      <Route path="question">
        <IndexRoute component={Question.List}/>
        <Route path="add" component={Question.Add}/>
        <Route path="update/:id" component={Question.Update}/>
        <Route path="query/:id" component={Question.Detail}/>
      </Route>
      <Route path="exercise">
        <IndexRoute component={Exercise.List}/>
        <Route path="add" component={Exercise.Add}/>
        <Route path="itemList/:id" component={Exercise.ItemList}/>
        <Route path="update/:id" component={Exercise.Update}/>
        <Route path="query/:id" component={Exercise.Detail}/>
      </Route>
    </Route>
    <Route path="activity">
      <IndexRoute component={Activity.List}/>
      <Route path="my" component={Activity.PersonList}/>
      <Route path="deal" component={Activity.ContentList}/>
      <Route path="add" component={Activity.Add}/>
      <Route path="task/add/:id" component={Activity.ActivityOptions}/>
      <Route path="info/:id" component={Task.AddItem}/>
      <Route path="query/:id" component={Activity.Detail}/>
      <Route path="deal/:id" component={Activity.Deal}/>
      <Route path="member/:id" component={Task.Member}/>
      <Route path="task/query/:id" component={Task.Deal}/>
      <Route path="update/:id" component={Activity.Update}/>
      <Route path="task/update/:id" component={Task.UpdateItem}/>
      <Route path="task/chart/:id" component={Task.Chart}/>
      <Route path="task/chartDetail/:id" component={Task.ChartDetail}/>
      <Route path="task/count/:id" component={Task.Count}/>
      <Route path="task/quiz/:id" component={Task.Quiz}/>
    </Route>
  </Route>
);

export default router;
