/**
 * Created by Administrator on 2015/7/23.
 */
var React = require('react');
var Notice = {};
import { History } from 'react-router';
var Util = require('./util');
require('./list.css');
var PageNum = require('../Pagination');
var GradeClass = require('../school/cls/util').GradeClass;
var GradeSelect = require('../resource/resource').GradeSelect;
var notification = require('antd/lib/notification');
var config = require('../config');
var Tabs = require('antd/lib/tabs');
var TabPane = Tabs.TabPane;

Notice.List = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      page: 0,
      totalPage: 0,
      flag: 0
    };
  },
  changePage: function (page) {
    if (page) {
      var title = $('#title').val();
      var receiverLevel = $("input[name='receiverLevel']:checked").val();
      this.find(Number.parseInt(receiverLevel), title, page);
    }
  },
  componentDidMount: function () {
    this.find(0, 0, 1);
  },
  publish: function (event) {
    this.history.pushState(null, '/notice/add/');
    event.stopPropagation();
  },
  find: function (receiverLevel, title, page, flag) {
    var condition = {};
    if (page) {
      condition.pageNO = page;
    } else {
      condition.pageNO = 1;
    }
    if (receiverLevel !== 0) {
      condition.receiverLevel = receiverLevel;
    }
    if (title) {
      condition.title = title;
    }
    if (typeof flag === 'undefined') {
      condition.flag = this.state.flag;
    } else {
      condition.flag = flag;
    }
    condition.pageSize = 10;
    var that = this;
    $.get(config.ip + 'learn/messages/query/page', condition, function (data) {
      if (data.code) {
        var list = data.data;
        console.log(list);
        that.setState({list: list, page: data.pageNow, totalPage: data.total});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  search: function (event) {
    var title = $('#title').val();
    var receiverLevel = $("input[name='receiverLevel']:checked").val();
    this.find(Number.parseInt(receiverLevel), title, 0);
    if (event) {
      event.stopPropagation();
    }
  },
  handleTab: function (num) {
    this.setState({flag: num});
    var title = $('#title').val();
    var receiverLevel = $("input[name='receiverLevel']:checked").val();
    this.find(Number.parseInt(receiverLevel), title, 0, num);
  },
  render: function () {
    var NoticeList = Util.NoticeList;
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">通知公告</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-comments"></i> 通知公告</div>
            <div className="row">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-addon">标题</span>
                  <input id='title' type="text" className="form-control"
                         aria-describedby="basic-addon1"/>
                </div>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <div className="col-md-3">
                    <input name="receiverLevel" type="radio" className="flat"
                           value="0" defaultChecked/><label>全部 </label>
                  </div>
                  <div className="col-md-3">
                    <input name="receiverLevel" type="radio" className="flat"
                           value="1"/><label>学校 </label>
                  </div>
                  <div className="col-md-3">
                    <input name="receiverLevel" type="radio" className="flat"
                           value="2"/><label>年级</label>
                  </div>
                  <div className="col-md-3">
                    <input name="receiverLevel" type="radio" className="flat"
                           value="3"/><label>班级</label>
                  </div>
                </div>
              </div>
              <div className="col-md-4 ">
                <button onClick={this.publish} className="btn bg-green pull-right" type="button"><i
                  className="fa fa-paper-plane-o"> 发布公告</i></button>
                <button onClick={this.search} className="btn bg-green pull-left" type="button"><i
                  className="fa fa-search"></i>
                </button>
              </div>
            </div>
            <div className="row">
              <Tabs onChange={this.handleTab}>
                <TabPane tab="接收" key={0}>
                </TabPane>
                <TabPane tab="发送" key={1}>
                </TabPane>
              </Tabs>
              <NoticeList list={this.state.list}/>
              <PageNum total={this.state.totalPage} current={this.state.page}
                       changePage={this.changePage}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

Notice.Add = React.createClass({
  mixins: [History],
  chooseClass: function (id) {
    $("[name='cls']").val(id);
  },
  selectGrade: function (id) {
    $("[name='gradeID']").val(id);
  },
  confirm: function (event) {
    var that = this;
    $.post('/learn/messages/add', $("#noticeForm").serialize(), function (data) {
      if (data.code) {
        that.history.pushState(null, '/notice');
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
  },
  handleChange: function (event) {
    var value = Number.parseInt(event.target.value);
    if (value === 2) {
      $("#grade").removeClass('hidden');
      $("#cls").addClass('hidden');
    } else if (value === 3) {
      $("#cls").removeClass('hidden');
      $("#grade").addClass('hidden');
    } else {
      $("#cls").addClass('hidden');
      $("#grade").addClass('hidden');
    }
  },
  render: function () {
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">发布通知</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-comments"></i> 发布通知</div>
            <form id="noticeForm" className="form-horizontal col-md-9">

              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square-o"></i> 通知标题</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input name="title" type="text" className="form-control"/>
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-list-ul"></i> 通知类型</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <select name="receiverLevel" onChange={this.handleChange}
                          className="form-control md">
                    <option value="1">学校</option>
                    <option value="2">年级</option>
                    <option value="3">班级</option>
                  </select>
                </div>
              </div>
              <div id="cls" className="hidden">
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">
                    <i className="fa fa-cogs"></i> 班级</label>

                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <GradeClass chooseClass={this.chooseClass}/>
                    <input type="hidden" name="cls"/>
                  </div>
                </div>
              </div>

              <div id="grade" className="hidden">
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">
                    <i className="fa fa-cogs"></i> 年级</label>

                  <div className="col-md-9 col-sm-9 col-xs-12" style={{width: '170px'}}>
                    <GradeSelect choose={this.selectGrade}/>
                  </div>
                  <input type="hidden" name="gradeID"/>
                </div>
              </div>

              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-file-text-o"></i> 通知内容</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea name="detail" className="form-control" rows="5"></textarea>
                </div>
              </div>
              <div>
                <button onClick={this.confirm} className="btn bg-green pull-right"
                        type="button"><i
                  className="fa fa-paper-plane-o"> 发布</i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Notice;
