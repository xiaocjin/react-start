/**
 * Created by Administrator on 2015/8/27.
 */
/**
 * Created by Administrator on 2015/7/23.
 */
import React from 'react';
import ReactDOM from 'react-dom';
var Task = {};
import { History } from 'react-router';
var Util = require('./util');
var ActivityModal = require('./activityModal');
var ExerciseUtil = require('../resource/exercise/util');
var Uploader = require('../upload.js');
var UploadBody = require('../upload/body');

var config = require('../config');
require('../../../bower_components/star');
var notification = require('antd/lib/notification');
var Modal = require('antd/lib/modal');
var confirm = Modal.confirm;
var Datepicker = require('antd/lib/datepicker');

var Pagination = require('antd/lib/pagination');
var Table = require('antd/lib/table');

/**
 * 任务列表
 * @type {*|Function}
 */
Task.ActivityTasks = React.createClass({
  mixins: [History],
  del: function (i) {
    this.props.del(i);
  },
  addItem: function (event) {
    this.history.pushState(null, '/activity/info/' + this.props.node);
    event.stopPropagation();
  },
  deal: function (node) {
    this.props.deal(node);
  },
  chart: function (node) {
    this.props.chart(node);
  },
  detail: function (node, event) {
    //var cls = this.state.classList;
    //this.props.deal(node.id);
    event.stopPropagation();
  },
  render: function () {
    var ActivityItems = Util.TaskList;
    var content;
    if (this.props.update) {
      content =
        <div className="x_panel">
          <div className="x_content">
            <ActivityItems list={this.props.list} del={this.del} update/>
          </div>
          <div className="ant-table-pagination">
            <button onClick={this.addItem} className="btn bg-green pull-right" type="button"><i
              className="fa fa-plus"> 添加任务</i></button>
          </div>
        </div>;
    } else if (this.props.deal) {
      content =
        <div className="x_panel">
          <div className="x_content">
            <ActivityItems list={this.props.list} deal={this.deal} chart={this.chart}/>
          </div>
        </div>;
    } else if (this.props.detail) {
      content =
        <div className="x_panel">
          <div className="x_content">
            <ActivityItems list={this.props.list} detail={this.detail}/>
          </div>
        </div>;
    } else {
      content =
        <div className="x_panel">
          <div className="x_content">
            <ActivityItems list={this.props.list}/>
          </div>
        </div>;
    }
    return (
      <div>
        {content}
      </div>
    );
  }
});

/**
 * 添加任务
 * @type {*|Function}
 */
Task.AddItem = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      mShow: false,
      resourceFiles: []
    };
  },
  delFile: function (i) {
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        var list = that.state.resourceFiles;
        list.splice(i, 1);
        that.setState({list: list});
      },
      onCancel: function () {
      }
    });
  },
  submit: function (event) {
    var id = this.props.params.id;
    var that = this;
    var classification = ReactDOM.findDOMNode(this.refs.classification).value.trim();
    var title = ReactDOM.findDOMNode(this.refs.title).value.trim();
    var description = ReactDOM.findDOMNode(this.refs.description).value.trim();
    var finishDate = ReactDOM.findDOMNode(this.refs.finishDate).value.trim();
    if (finishDate === '') {
      finishDate = new Date().getTime();
    }
    var body = {};
    body.classification = classification;
    body.title = title;
    body.description = description;
    body.finishDate = finishDate;
    body.learnPlanID = id;
    var fs = that.state.resourceFiles;
    body.resourceFiles = JSON.stringify(fs);
    if (Number.parseInt(classification) === 1) {
      var exercise = this.state.list;
      if (exercise.length) {
        body.exerciseID = exercise[0].id;
      }
    }
    $.post('/learn/activity/add/task', body, function (data) {
      if (data.code) {
        that.history.pushState(null, '/activity/task/add/' + id);
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
  },
  showModal: function () {
    this.setState({mShow: true});
  },
  addExercise: function (data) {
    var exercise = [];
    if (data) {
      exercise.push(data);
      this.setState({list: exercise});
    }
  },
  queryExercise: function (node) {
    this.history.pushState(null, '/exercise/query/' + node.id);
  },
  handleChange: function (event) {
    //this.setState({value: event.target.value});
    if (Number.parseInt(event.target.value) === 1) {
      $('#b').removeClass('hidden');
      //$('#a').addClass('hidden');
    } else {
      //$('#a').removeClass('hidden');
      $('#b').addClass('hidden');
    }
  },
  componentDidMount: function () {
    this.up = new Uploader();
    var loader = this.up.getLoader();
    var that = this;
    loader.on('fileSuccess', function (file, message) {
      var data = {};
      var m = JSON.parse(message);
      data.url = m.url;
      data.title = file.fileName;
      var files = that.state.resourceFiles;
      files.push(data);
      that.setState({resourceFiles: files});
    });
    //活动id
    //var id = this.props.params.id;
    //$("[name='learnPlanID']").val(id);
  },
  upload(){
    this.up.upload();
  },
  pause(){
    this.up.pause();
  },
  cancel(){
    this.up.cancel();
  },
  componentWillUnmount: function () {
    this.up = null;
  },
  handleDateChange: function (value) {
    $("[name='finishDate']").val(value.getTime());
  },
  render: function () {
    let smClose = () => this.setState({mShow: false});
    var ExerciseList = ExerciseUtil.ExerciseList;
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">新建任务</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>
          <div className="form-group col-md-12">
            <button onClick={this.submit} className="btn bg-green pull-right"
                    type="button"><i
              className="fa fa-upload">
              保存</i></button>
          </div>
          <div className="large">
            <div className="title"><i className="fa fa-comments"></i> 基本信息</div>
            <form id="taskForm" className="form-horizontal col-md-9">

              <div className="form-group col-md-12">
                <input ref="learnPlanID" name="learnPlanID" type="hidden"/>
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input ref="title" name="title" type="text" className="form-control lg"/>
                </div>
              </div>
              <div className="form-group col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12">
                  <i className="fa fa-calendar"></i> 完成时间</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <Datepicker showTime={true} onSelect={this.handleDateChange}
                              format="yyyy-MM-dd HH:mm:ss"/>
                </div>
                <input ref="finishDate" name="finishDate" type="hidden"/>
              </div>
              <div className="form-group col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cubes"></i> 类型</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <select ref="classification" name="classification"
                          onChange={this.handleChange}
                          className=" form-control md">
                    <option value="0">主观题</option>
                    <option value="1">客观题</option>
                  </select>
                </div>
              </div>


              <div className="form-group col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-paperclip"></i> 资源</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <UploadBody upload={this.upload} cancel={this.cancel} pause={this.pause}/>
                  <Util.Attachments update del={this.delFile}
                                    list={this.state.resourceFiles}/>
                </div>
              </div>

              <div className="form-group col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 描述</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea ref="description" className="form-control" rows="5"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div id='b' className="hidden large">
            <div className="title"><i className="fa fa-comments"></i> 练习</div>

            <ExerciseList query list={this.state.list}/>

            <div className="ant-table-pagination">
              <button onClick={this.showModal} className="ant-btn ant-btn-primary" type="button">
                <i className="fa fa-pencil-square-o"> 选择练习</i></button>
            </div>

          </div>
          <ActivityModal visible={this.state.mShow} onHide={smClose} onTrue={this.addExercise}
                         query={this.queryExercise}/>
        </div>
      </div>
    );
  }
});


/**
 * 更新任务
 * @type {*|Function}
 */
Task.UpdateItem = React.createClass({
  mixins: [History],
  showModal: function () {
    this.setState({mShow: true});
  },
  addExercise: function (data) {
    var exercise = [];
    if (data) {
      exercise.push(data);
      this.setState({list: exercise});
    }
  },
  queryExercise: function (node) {
    this.setState({mShow: false});
    this.history.pushState(null, '/exercise/query/' + node.id, node);
  },
  submit: function (event) {
    var that = this;
    var id = that.props.params.id;
    var learnPlanID = $("[name='learnPlanID']").val();
    var classification = ReactDOM.findDOMNode(this.refs.classification).value.trim();
    var title = ReactDOM.findDOMNode(this.refs.title).value.trim();
    var description = ReactDOM.findDOMNode(this.refs.description).value.trim();
    var finishDate = ReactDOM.findDOMNode(this.refs.finishDate).value.trim();
    var body = {};
    body.classification = classification;
    body.title = title;
    body.description = description;
    body.finishDate = finishDate;
    body.learnPlanID = learnPlanID;
    body.taskID = id;
    var fs = that.state.resourceFiles;
    body.resourceFiles = JSON.stringify(fs);
    let { query } = this.props.location;
    var type = Number.parseInt(query.type);
    if (type === 1) {
      var exercise = this.state.list;
      if (exercise.length) {
        body.exerciseID = exercise[0].id;
      }
    }
    $.post('/learn/activity/update/task', body, function (data) {
      if (data.code) {
        that.history.pushState(null, '/activity/task/add/' + learnPlanID);
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
  },
  getInitialState: function () {
    return {
      resourceFiles: [],
      list: [],
      mShow: false,
      finishDate: ''
    };
  },
  upload(){
    this.up.upload();
  },
  pause(){
    this.up.pause();
  },
  cancel(){
    this.up.cancel();
  },
  delFile: function (i) {
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        var list = that.state.resourceFiles;
        list.splice(i, 1);
        that.setState({list: list});
      },
      onCancel: function () {
      }
    });
  },
  componentWillUnmount: function () {
    this.up = null;
  },
  componentDidMount(){
    this.up = new Uploader();
    var loader = this.up.getLoader();
    var that = this;
    loader.on('fileSuccess', function (file, message) {
      var data = {};
      var m = JSON.parse(message);
      data.url = m.url;
      data.title = file.fileName;
      var files = that.state.resourceFiles;
      files.push(data);
      that.setState({resourceFiles: files});
    });
    var id = that.props.params.id;
    $.get(config.ip + 'learn/activity/query/task/detail', {id: id}, function (data) {
      if (data.code) {
        var da = data.data;
        $("[name='classification']").val(da.classification);
        $("[name='title']").val(da.title);
        $('#description').val(da.description);
        var time = window.moment(da.finishDate).format("YYYY-MM-DD HH:mm:ss");
        $("[name='finishDate']").val(da.finishDate);
        $("[name='taskID']").val(id);
        $("[name='learnPlanID']").val(da.learnPlan.id);
        var attachments = da.attachmentList || [];
        var quiz = da.exercise;
        if (quiz) {
          quiz.key = quiz.id;
          var exercise = [];
          exercise.push(quiz);
          that.setState({resourceFiles: attachments, finishDate: time, list: exercise});
        } else {
          that.setState({resourceFiles: attachments, finishDate: time});
        }
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  handleDateChange: function (value) {
    $("[name='finishDate']").val(value.getTime());
    var time = window.moment(value.getTime()).format("YYYY-MM-DD HH:mm:ss");
    this.setState({
      finishDate: time
    });
  },
  render: function () {
    let smClose = () => this.setState({mShow: false});
    var ExerciseList = ExerciseUtil.ExerciseList;
    let { query } = this.props.location;
    var type = Number.parseInt(query.type);
    var content = '';
    var typeText = '';
    if (type === 1) {
      content = <div className="large">
        <div className="title"><i className="fa fa-comments"></i> 练习</div>
        <ExerciseList query list={this.state.list}/>

        <div className="ant-table-pagination">
          <button onClick={this.showModal} className="ant-btn ant-btn-primary" type="button">
            <i className="fa fa-pencil-square-o"> 选择练习</i></button>
        </div>
        <ActivityModal visible={this.state.mShow} onHide={smClose} onTrue={this.addExercise}
                       query={this.queryExercise}/>
      </div>;
      typeText = '客观题';
    } else {
      typeText = '主观题';
    }
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">编辑任务</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>
          <div>
            <button onClick={this.submit} className="btn bg-green pull-right"
                    type="button"><i
              className="fa fa-upload">
              保存</i></button>
          </div>
          <div className="large">
            <div className="title"><i className="fa fa-comments"></i> 基本信息</div>
            <form id="itemForm" className="form-horizontal col-md-9">

              <div className="form-group col-md-12">
                <input name="taskID" type="hidden"/>
                <input name="learnPlanID" type="hidden"/>
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input ref="title" name="title" type="text"
                         className="form-control lg"/>
                </div>
              </div>
              <div className="form-group col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12">
                  <i className="fa fa-calendar"></i> 完成时间</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <Datepicker showTime={true} value={this.state.finishDate}
                              onSelect={this.handleDateChange}
                              format="yyyy-MM-dd HH:mm:ss"/>
                </div>
                <input ref="finishDate" name="finishDate" type="hidden"/>
              </div>
              <div className="form-group col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cubes"></i> 类型</label>

                <label className="col-md-9 col-sm-9 col-xs-12 control-label-text">
                  {typeText}
                </label>
                <input ref="classification" name="classification" type="hidden"/>
              </div>


              <div className="form-group col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-paperclip"></i> 资源</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <UploadBody upload={this.upload} cancel={this.cancel}
                              pause={this.pause}/>
                  <Util.Attachments update del={this.delFile}
                                    list={this.state.resourceFiles}/>
                </div>
              </div>

              <div className="form-group col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 描述</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                                            <textarea id="description" name="description" ref="description"
                                                      className="form-control"
                                                      rows="5"></textarea>
                </div>
              </div>
            </form>
          </div>
          {content}
        </div>
      </div>
    );
  }
});

/**
 * 班级成员反馈信息
 * @type {*|Function}
 */
Task.Member = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      active: 0,
      cls: [],
      taskId: this.props.params.id
    };
  },
  changeClass: function (cid) {
    this.setState({active: cid});
  },
  componentDidMount: function () {
    //taskid
    //var id = this.props.params.id;
    let { query } = this.props.location;
    var that = this;
    //获取已下发班级
    $.get(config.ip + 'learn/learnplans/prePublish', {id: query.aid}, function (data) {
      if (data.code) {
        var da = data.data;
        var cls = da.schoolClassesAdded;
        if (query.cid) {
          that.setState({active: query.cid, cls: cls});
        } else {
          if (cls.length) {
            that.setState({active: cls[0].classID, cls: cls});
          }
        }

      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  render: function () {
    let { query } = this.props.location;
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">答题情况</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 答题情况</div>
            <Util.ClassMember changeClass={this.changeClass} cls={this.state.cls}
                              taskId={this.state.taskId}/>
            <Util.Member cid={this.state.active} taskId={this.state.taskId} aid={query.aid}
                         type={query.type}/>
          </div>
        </div>
      </div>
    );
  }
});

/**
 * 批阅
 * @type {*|Function}
 */
Task.Deal = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      task: {},
      feeds: [],
      mark: 0
    };
  },
  componentDidMount: function () {
    var id = this.props.params.id;
    let { query } = this.props.location;
    var uid = query.uid;
    var that = this;
    $.get(config.ip + 'learn/activity/query/task/personInfo', {
      studentID: uid,
      taskID: id,
      type: 0
    }, function (data) {
      if (data.code) {
        var obj = data.data;
        var mark = {};
        if (obj.markings.length) {
          mark = obj.markings[0];
        }
        var score;
        if (mark.score) {
          score = mark.score;
          $('.starrr')
            .attr('data-rating', score);
        } else {
          score = 0;
        }
        $('#con').val(mark.content);
        $(".starrr").starrr();
        $('.starrr').on('starrr:change', function (e, value) {
          //alert('new rating is ' + value);
          that.setState({mark: value});
        });
        that.setState({task: obj.task, feeds: obj.taskFeedbacks, mark: score});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });

  },
  submit: function () {
    var id = this.props.params.id;
    let { query } = this.props.location;
    var uid = query.uid;
    var aid = query.aid;
    var cid = query.cid;
    var type = query.type;
    var that = this;
    var content = $('#con').val();
    $.post('/learn/activity/task/mark', {
      studentID: uid,
      taskID: id,
      score: this.state.mark,
      content: content
    }, function (data) {
      if (data.code) {
        that.history.pushState(null, '/activity/member/' + id, {aid: aid, cid: cid, type: type});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
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
                            <span className="ant-breadcrumb-link">活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">批阅</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 任务详情</div>
            <div className="form-group col-md-12 col-sm-12 col-xs-12">
              <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                className="fa fa-pencil-square"></i> 名称</label>

              <div className="col-md-8 col-sm-8 col-xs-12">
                {this.state.task.title}
              </div>
            </div>
            <div className="form-group col-md-12 col-sm-12 col-xs-12">
              <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                className="fa fa-comments"></i> 描述</label>

              <div className="col-md-8 col-sm-8 col-xs-12">
                {this.state.task.description}
              </div>
            </div>

            <div className="form-group col-md-12 col-sm-12 col-xs-12">
              <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                className="fa fa-paperclip"></i> 资源</label>

              <div className="col-md-8 col-sm-8 col-xs-12">
                <Util.Attachments list={this.state.task.attachmentList}/>
              </div>
            </div>
            <div className="form-group col-md-12 col-sm-12 col-xs-12">
              <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                className="fa fa-pencil"></i> 反馈</label>

              <div className="col-md-8 col-sm-8 col-xs-12">
                <Util.Feeds list={this.state.feeds}/>
              </div>
            </div>
          </div>
          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 批阅</div>
            <form id="assessForm">
              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                  className="fa fa-star-o"></i> 评分</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <div className='starrr'></div>
                </div>
              </div>
              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                  className="fa fa-check-square-o"></i> 评价</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                                            <textarea id="con" name="content" className="form-control"
                                                      rows="5"></textarea>
                </div>
              </div>
              <div className="form-group col-md-12 col-sm-12 col-xs-12">

                <div className="col-md-8 col-sm-8 col-xs-12 .col-md-offset-2 .col-sm-offset-2">
                  <button onClick={this.submit} className="btn bg-green"
                          type="button"><i className="fa fa-upload">
                    确定</i></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

Task.Count = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      cls: []
    };
  },
  componentDidMount(){
    var that = this;
    var id = that.props.params.id;
    let { query } = this.props.location;
    $.get(config.ip + 'learn/activity/query/task/detail', {id: id}, function (data) {
      if (data.code) {
        var da = data.data;
        $("#title").html(da.title);
        $('#description').html(da.description);
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    $.get(config.ip + 'learn/learnplans/prePublish', {id: query.aid}, function (data) {
      if (data.code) {
        var da = data.data;
        var cls = da.schoolClassesAdded;
        that.setState({cls: cls});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  handleClick: function (node, e) {
    var id = this.props.params.id;
    this.history.pushState(null, '/activity/task/chart/' + id, {cid: node.classID});
    e.stopPropagation();
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
                            <span className="ant-breadcrumb-link">活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">任务统计</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 任务详情</div>
            <div className="form-group col-md-12 col-sm-12 col-xs-12">
              <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                className="fa fa-pencil-square"></i> 名称</label>

              <div id="title" className="col-md-8 col-sm-8 col-xs-12">
              </div>
            </div>
            <div className="form-group col-md-12 col-sm-12 col-xs-12">
              <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                className="fa fa-comments"></i> 描述</label>

              <div id="description" className="col-md-8 col-sm-8 col-xs-12">
              </div>
            </div>
            <div className="form-group col-md-12 col-sm-12 col-xs-12">
              <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                className="fa fa-bar-chart"></i> 统计</label>

              <div id="description" className="col-md-8 col-sm-8 col-xs-12">
                {this.state.cls.map(function (node) {
                  return (
                    <div onClick={this.handleClick.bind(this, node)}
                         key={node.classID}
                         className="col-md-4 col-sm-4 col-xs-6 team-member">
                      <a>{node.className}</a>
                    </div>
                  );
                }, this) }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
/**
 * 统计
 * @type {*|Function}
 */
Task.Chart = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      question: []
    };
  },
  componentDidMount(){

  },
  updateQuestion: function (question) {
    if (question.length) {
      this.setState({question: question});
    }
  },
  handleClick: function (e) {
    var id = this.props.params.id;
    let { query } = this.props.location;
    var questions = this.state.question;
    if (questions.length) {
      this.history.pushState(null, '/activity/task/chartDetail/' + id, {
        cid: query.cid,
        qid: questions[0].id
      });
    }
    e.stopPropagation();
  },
  render: function () {
    var id = this.props.params.id;
    let { query } = this.props.location;
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">任务统计</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-comments"></i> 基本信息</div>
            <div>
              <button onClick={this.handleClick} className="btn bg-green pull-right" type="button"><i
                className="fa fa-bar-chart"></i> 题目统计
              </button>
            </div>
            <Util.ChartQuiz taskID={id} classID={query.cid}
                            updateQuestion={this.updateQuestion}/>

          </div>
        </div>
      </div>
    );
  }
});

Task.ChartDetail = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      current: {},
      ids: [],
      now: 1
    };
  },
  handleClick: function (e) {
    var id = this.props.params.id;
    let { query } = this.props.location;
    this.history.pushState(null, '/activity/task/chart/' + id, {
      cid: query.cid
    });
    e.stopPropagation();
  },
  componentDidMount(){
    var id = this.props.params.id;
    let { query } = this.props.location;
    this.queryQuestion(id, query.cid, query.qid, 1);
    var that = this;

    $.get(config.ip + 'learn/activity/query/task/questionInfo', {taskID: id, classID: query.cid}, function (data) {
      if (data.code) {
        var statistics = data.data;
        var questions = statistics.questionCorrectStatistics || [];
        var num = [];
        for (var i in questions) {
          var question = questions[i];
          num.push(question.id);
        }
        that.setState({ids: num});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  queryQuestion: function (id, cid, qid, index) {
    var that = this;
    $.get(config.ip + 'learn/activity/query/task/questionInfo', {
      taskID: id,
      classID: cid,
      questionID: qid
    }, function (data) {
      if (data.code) {
        var ques = data.data;
        that.setState({current: ques, now: index});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  changePage: function (index) {
    var id = this.props.params.id;
    let { query } = this.props.location;
    this.queryQuestion(id, query.cid, this.state.ids[index - 1], index);
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
                            <span className="ant-breadcrumb-link">活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">任务统计</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-comments"></i> 基本信息</div>
            <div>
              <button onClick={this.handleClick} className="btn bg-green pull-right" type="button"><i
                className="fa fa-bar-chart"></i> 练习统计
              </button>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <Util.QuesContent current={this.state.current}/>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <Util.ChartQues current={this.state.current}/>
              <Pagination simple className="ant-table-pagination" onChange={this.changePage}
                          pageSize={1} current={this.state.now}
                          total={this.state.ids.length}/>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

/**
 * 查看学生答题情况
 * @type {*|Function}
 */
Task.Quiz = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      feeds: []
    };
  },
  componentDidMount: function () {
    var id = this.props.params.id;
    let { query } = this.props.location;
    var uid = query.uid;
    var that = this;
    $.get(config.ip + 'learn/activity/query/task/personInfo', {
      studentID: uid,
      taskID: id,
      type: 1
    }, function (data) {
      if (data.code) {
        var obj = data.data;
        $("#correctRate").html(obj.correctRate);
        $('#myScore').html(obj.myScore);
        for (var i in obj.questions) {
          obj.questions[i].key = obj.questions[i].id;
        }
        that.setState({feeds: obj.questions});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  render: function () {
    var columns = [
      {
        title: '题号', dataIndex: 'id',
        render: function (text, node, index) {
          return (<a href={"#/resource/question/query/" + text + "?type=" + node.type}>{index + 1}</a>);
        }
      },
      {
        title: '题型', dataIndex: 'type',
        render: function (text) {
          var type = Number.parseInt(text);
          if (type === 0) {
            return (<div>判断</div>);
          } else if (type === 1) {
            return (<div>单选</div>);
          } else if (type === 2) {
            return (<div>多选</div>);
          }
        }
      },
      {
        title: '学生选择', dataIndex: 'myAnswer',
        render: function (text, node) {
          var type = Number.parseInt(node.type);
          var answer = Number.parseInt(text);
          if (type === 0) {
            if (answer) {
              return (<div>正确</div>);
            } else {
              return (<div>错误</div>);
            }
          } else if (type === 1) {
            return (<div>{String.fromCharCode(65 + answer - 1)}</div>);
          } else {
            if (text) {
              var answers = text.split(',');
              var right = [];
              for (var i in answers) {
                right.push(String.fromCharCode(65 + Number.parseInt(answers[i]) - 1));
              }
              return (<div>{right}</div>);
            } else {
              return (<div></div>);
            }
          }
        }
      },
      {
        title: '正确答案', dataIndex: 'options',
        render: function (text, node) {
          var type = Number.parseInt(node.type);
          if (type === 0) {
            if (Number.parseInt(node.isCorrect)) {
              return (<div>正确</div>);
            } else {
              return (<div>错误</div>);
            }
          } else {
            var options = JSON.parse(text);
            var right = [];
            for (var i in options) {
              if (options[i].checked) {
                right.push(String.fromCharCode(65 + Number.parseInt(options[i].id) - 1));
              }
            }
            return (<div>{right}</div>);
          }
        }
      },
      {
        title: '是否正确', dataIndex: 'myCorrect',
        render: function (text) {
          if (Number.parseInt(text)) {
            return (<div><i className="fa fa-check text-green"></i></div>);
          } else {
            return (<div><i className="fa fa-times text-red"></i></div>);
          }
        }
      }
    ];
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">答题情况</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 答题统计</div>
            <div className="form-group col-md-6 col-sm-6 col-xs-12">
              <label className="control-label col-md-6 col-sm-6 col-xs-12"><i
                className="fa fa-pencil-square"></i> 正确率</label>

              <div id="correctRate" className="col-md-6 col-sm-6 col-xs-12 text-red">
              </div>
            </div>
            <div className="form-group col-md-6 col-sm-6 col-xs-12">
              <label className="control-label col-md-6 col-sm-6 col-xs-12"><i
                className="fa fa-comments"></i> 得分</label>

              <div id="myScore" className="col-md-6 col-sm-6 col-xs-12 text-red">
              </div>
            </div>
          </div>
          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 答题情况</div>
            <Table columns={columns}
                   dataSource={this.state.feeds}
                   className="table" pagination={false}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Task;
