/**
 * Created by Administrator on 2015/7/23.
 */
import React from 'react';
import ReactDOM from 'react-dom';
var Activity = {};
import { History } from 'react-router';
var Util = require('./util');
var ActivityPublishModal = require('./ActivityPublishModal');
var PageNum = require('../Pagination');
var Task = require('./task');
var GradeSelect = require('../resource/resource').GradeSelect;
var SubjectSelect = require('../resource/resource').SubjectSelect;
var ChapterSelect = require('../resource/resource').ChapterSelect;
var config = require('../config');
var Datepicker = require('antd/lib/datepicker');
var notification = require('antd/lib/notification');
/**
 * 活动单列表
 * @type {*|Function}
 */
Activity.List = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      mShow: false,
      cls: {}
    };
  },
  changePage: function (page) {
    //条件
    if (page) {
      var title = ReactDOM.findDOMNode(this.refs.title).value.trim();
      var condition = {pageNO: page};
      if (title !== '') {
        condition.title = title;
      }
      if (this.state.grade) {
        condition.gradeID = this.state.grade;
      }
      if (this.state.subject) {
        condition.subjectID = this.state.subject;
      }
      condition.pageSize = 10;
      var that = this;
      $.get(config.ip + 'learn/activity/query/page', condition, function (data) {
        if (data.code) {
          var list = data.data;
          console.log('data.pageNow:', data.pageNow);
          that.props.changePage(list, data.pageNow, data.total);
        } else {
          notification.error({
            message: "数据获取失败",
            description: data.msg
          });
        }
      });
    }

    //更新List
  },
  componentDidMount: function () {
    this.changePage(1);
  },
  addNew: function (event) {
    this.transitionTo('addActivity');
    event.stopPropagation();
  },
  search: function (event) {
    this.changePage(1);
    if (event) {
      event.stopPropagation();
    }
  },
  updateList: function (list) {
    this.setState({list: list});
  },
  selectGrade: function (id) {
    this.setState({grade: id});
  },
  selectSubject: function (id) {
    this.setState({subject: id});
  },
  choosePublishClass: function (id) {
    var that = this;
    $.get(config.ip + 'learn/learnplans/prePublish', {id: id}, function (data) {
      if (data.code) {
        var da = data.data;
        console.log(da);
        that.setState({aid: id, cls: da, mShow: true});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  publish: function (ids) {
    //var that = this;
    $.post('/learn/activity/publish', {id: this.state.aid, cls: ids.toString()}, function (data) {
      if (data.code) {
        notification.success({
          message: "发布成功",
          description: '活动单发布成功！'
        });
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  render: function () {
    var ActivityList = Util.ActivityList;
    var content;
    var buttonContent;
    var pageNum;
    let smClose = () => this.setState({mShow: false});
    if (this.props.type) {
      var type = Number.parseInt(this.props.type);
      if (type === 1) {
        content = <ActivityList school list={this.props.list} updateList={this.updateList}/>;
        buttonContent = <div className="col-md-3 pull-right">
          <button onClick={this.search} className="btn bg-green pull-right" type="button"><i
            className="fa fa-search"></i>
          </button>
        </div>;
      } else if (type === 2) {
        content = <ActivityList choosePublishClass={this.choosePublishClass} list={this.props.list}
                                updateList={this.updateList}/>;
        buttonContent = <div className="col-md-3 pull-right">
          <button onClick={this.addNew} className="btn bg-green pull-right" type="button"><i
            className="fa fa-plus">
            新建活动单</i></button>
          <button onClick={this.search} className="btn bg-green pull-left" type="button"><i
            className="fa fa-search"></i>
          </button>
        </div>;
      } else if (type === 3) {
        content = <ActivityList deal list={this.props.list} updateList={this.updateList}/>;
        buttonContent = <div className="col-md-3 pull-right">
          <button onClick={this.search} className="btn bg-green pull-left" type="button"><i
            className="fa fa-search"></i>
          </button>
        </div>;
      }
    }
    if (this.props.totalPage) {
      pageNum = <PageNum total={this.props.total} current={this.props.page} changePage={this.changePage}/>;
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
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> {this.props.title}</div>
            <div className="row">
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-addon">名称</span>
                  <input ref="title" name="title" type="text" className="form-control"/>
                </div>
              </div>
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-addon">年级</span>
                  <GradeSelect choose={this.selectGrade}/>
                </div>
              </div>
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-addon">学科</span>
                  <SubjectSelect choose={this.selectSubject}/>
                </div>
              </div>
              {buttonContent}
            </div>
            <div className="row">
              {content}
              {pageNum}
            </div>
          </div>
        </div>
        <ActivityPublishModal cls={this.state.cls} visible={this.state.mShow} onHide={smClose}
                              onTrue={this.publish}/>
      </div>
    );
  }
});

/**
 * 活动单首页（公共）
 * @type {*|Function}
 */
Activity.Index = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      page: 0,
      total: 0
    };
  },
  changePage(list, page, total){
    console.log('page:', page);
    this.setState({list: list, page: page, total: total});
  },
  render: function () {
    return (
      <Activity.List {...this.state} type="1" changePage={this.changePage} title="校内资源"/>
    );
  }
});

/**
 * 我的活动单
 * @type {*|Function}
 */
Activity.PersonList = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      page: 0,
      total: 0
    };
  },
  changePage(list, page, totalPage){
    this.setState({list: list, page: page, total: totalPage});
  },
  render: function () {
    return (
      <Activity.List {...this.state} type="2" changePage={this.changePage} title="我的活动单"/>
    );
  }
});

/**
 * 批阅列表
 * @type {*|Function}
 */
Activity.ContentList = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      page: 0,
      total: 0
    };
  },
  changePage(list, page, totalPage){
    this.setState({list: list, page: page, total: totalPage});
  },
  //componentDidMount: function () {
  //    var that = this;
  //    $.get(config.ip + 'learn/activity/query/page', {pageNO: 1, role: 1}, function (data) {
  //        if (data.code) {
  //            var list = data.data;
  //            console.log(list);
  //            that.setState({list: list, page: data.pageNow, totalPage: data.totalPage});
  //        } else {
  //            that.props.handleAlertShow(data.msg);
  //        }
  //    });
  //},
  render: function () {
    return (
      <Activity.List {...this.state} type="3" changePage={this.changePage} title="批阅活动单"/>
    );
  }
});

/**
 * 添加活动单
 * @type {*|Function}
 */
Activity.Add = React.createClass({
  mixins: [History],
  componentDidMount: function () {

  },
  getInitialState: function () {
    return {
      grade: 0,
      subject: 0,
      chapter: [],
      selectFirst: 0,
      selectSecond: 0,
      selectLast: 0
    };
  },
  next: function (event) {
    var title = $("[name='title']").val();
    var description = $('#description').val();
    var that = this;
    $.post('/learn/activity/add', $("#activityForm").serialize(), function (data) {
      if (data.code) {
        that.history.pushState(null, '/activity/task/add/' + data.data, {title: title, description: description});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
  },
  selectGrade: function (id) {
    $("[name='gradeID']").val(id);
    this.setState({grade: id});
    var that = this;
    if (this.state.subject) {
      var condition = {
        grade: id,
        subject: this.state.subject
      };
      $.get(config.ip + 'learn/chapters/list', condition, function (data) {
        if (data.code) {
          var list = data.data || [];
          console.log(list);
          that.setState({
            chapter: list, selectFirst: 0,
            selectSecond: 0,
            selectLast: 0
          });
        } else {
          notification.error({
            message: "数据获取失败",
            description: data.msg
          });
        }
      });
    }
  },
  selectSubject: function (id) {
    $("[name='subjectID']").val(id);
    this.setState({subject: id});
    var that = this;
    if (this.state.grade) {
      var condition = {
        grade: this.state.grade,
        subject: id
      };
      $.get(config.ip + 'learn/chapters/list', condition, function (data) {
        if (data.code) {
          var list = data.data || [];
          console.log(list);
          that.setState({
            chapter: list, selectFirst: 0,
            selectSecond: 0,
            selectLast: 0
          });
        } else {
          notification.error({
            message: "数据获取失败",
            description: data.msg
          });
        }
      });
    }
  },
  selectChapter: function (id, level) {
    console.log(id);
    $("[name='chapterID']").val(id);
    level = Number.parseInt(level);
    if (level === 1) {
      this.setState({selectFirst: id, selectSecond: 0, selectLast: 0});
    } else if (level === 2) {
      this.setState({selectSecond: id, selectLast: 0});
    } else if (level === 3) {
      this.setState({selectLast: id});
    }
  },
  handleDateChange: function (value) {
    console.log(new Date(value.getTime()));
    $("[name='beginDate']").val(value.getTime());
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
                            <span className="ant-breadcrumb-link">新建活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 活动单信息</div>
            <form id="activityForm" className="form-horizontal col-md-12">
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input name="title" type="text" className="form-control lg"/>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cogs"></i> 年级</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <GradeSelect choose={this.selectGrade}/>
                  </div>
                  <input ref="grade" type="hidden" name="gradeID"/>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-leaf"></i> 学科</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <SubjectSelect choose={this.selectSubject}/>
                  </div>
                  <input ref="subject" type="hidden" name="subjectID"/>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cubes"></i> 章节</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <ChapterSelect chapter={this.state.chapter}
                                   selectFirst={this.state.selectFirst}
                                   selectSecond={this.state.selectSecond}
                                   selectLast={this.state.selectLast}
                                   choose={this.selectChapter}/>
                  </div>
                </div>
                <input ref="chapter" type="hidden" name="chapterID"/>
              </div>


              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-calendar"></i> 开始日期</label>
                <input ref="beginDate" type="hidden" name="beginDate"/>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <Datepicker showTime={true} onSelect={this.handleDateChange}
                              format="yyyy-MM-dd HH:mm:ss"/>
                </div>
              </div>
              <div className="clearfix"></div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 描述</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea id="description" className="form-control" rows="5"></textarea>
                </div>
              </div>


              <div className="clearfix"></div>
              <button onClick={this.next} className="btn bg-green pull-right" type="button"><i
                className="fa fa-arrow-right">
                下一步</i></button>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

/**
 * 添加活动时显示的列表
 * @type {*|Function}
 */
Activity.ActivityOptions = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: []
    };
  },
  del: function (i) {
    /**
     * http post data
     */
    var list = this.state.list;
    list.splice(i, 1);
    this.setState({list: list});
  },
  componentDidMount: function () {
    var that = this;
    let { query } = this.props.location;
    if (query.title) {
      $('#title').html(query.title);
      $('#description').html(query.description);
    } else {
      var id = that.props.params.id;
      $.get(config.ip + 'learn/learnplans/get', {id: id}, function (data) {
        if (data.code) {
          var da = data.data;
          $('#title').html(da.title);
          $('#description').html(da.description);
          console.log(da.taskList);
          that.setState({list: da.taskList});
        } else {
          notification.error({
            message: "数据获取失败",
            description: data.msg
          });
        }
      });
    }
  },
  render: function () {
    var id = this.props.params.id;
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
                            <span className="ant-breadcrumb-link">任务</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 任务信息</div>
            <div className="row">
              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <div id="title" className="col-md-10 col-sm-10 col-xs-12">
                </div>
              </div>
              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                  className="fa fa-comments"></i> 描述</label>

                <div id="description" className="col-md-10 col-sm-10 col-xs-12">
                </div>
              </div>
            </div>
            <div className="row">
              <Task.ActivityTasks list={this.state.list} node={id} update/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


/**
 * 活动单详情
 * @type {*|Function}
 */
Activity.Detail = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      grade: 0,
      subject: 0
    };
  },
  componentDidMount: function () {
    var that = this;
    var id = that.props.params.id;
    $.get(config.ip + 'learn/learnplans/get', {id: id}, function (data) {
      if (data.code) {
        var da = data.data;
        console.log(da);
        $('#title').html(da.title);
        $('#description').html(da.description);
        var time = window.moment(da.beginDate).format("YYYY-MM-DD HH:mm:ss");
        $('#beginDate').html(time);
        var grade = da.grade.id;
        var subject = da.subject.id;
        $('#chapter').html(da.chapterTitle);
        console.log('taskList', da.taskList, grade, subject);
        that.setState({list: da.taskList, grade: grade, subject: subject});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  render: function () {
    var id = this.props.params.id;
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
                            <span className="ant-breadcrumb-link">活动单信息</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 基本信息</div>
            <form id="activityForm" className="form-horizontal col-md-12">
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <label id="title" className="col-md-9 col-sm-9 col-xs-12">

                </label>
              </div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cogs"></i> 年级</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <GradeSelect select={this.state.grade} disabled/>
                  </div>
                  <input ref="grade" type="hidden" name="gradeID"/>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-leaf"></i> 学科</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <SubjectSelect select={this.state.subject} disabled/>
                  </div>
                  <input ref="subject" type="hidden" name="subjectID"/>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cubes"></i> 章节</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div id="chapter" className="col-md-6 col-sm-12 col-xs-12"
                       style={{padding: 0}}>

                  </div>
                </div>
                <input ref="chapter" type="hidden" name="chapterID"/>
              </div>

              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-calendar"></i> 开始日期</label>

                <label id="beginDate" className="col-md-9 col-sm-9 col-xs-12">

                </label>
              </div>
              <div className="clearfix"></div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 描述</label>

                <label id="description" className="col-md-9 col-sm-9 col-xs-12">

                </label>
              </div>


              <div className="clearfix"></div>
            </form>
          </div>
          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 任务</div>
            <Task.ActivityTasks list={this.state.list} node={id}/>
          </div>
        </div>
      </div>
    );
  }
});

/**
 * 更新活动单
 * @type {*|Function}
 */
Activity.Update = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      grade: 0,
      subject: 0,
      chapter: [],
      selectFirst: 0,
      selectSecond: 0,
      selectLast: 0,
      beginDate: ""
    };
  },
  componentDidMount: function () {
    var that = this;
    var id = that.props.params.id;
    $.get(config.ip + 'learn/learnplans/get', {id: id}, function (data) {
      if (data.code) {
        var da = data.data;
        console.log(da);
        $("[name='title']").val(da.title);
        $('#description').val(da.description);
        $("[name='gradeID']").val(da.grade.id);
        $("[name='subjectID']").val(da.subject.id);
        var chapterId = '';
        if (da.chapter.length) {
          chapterId = da.chapter[da.chapter.length - 1].id;
        }
        $("[name='chapterID']").val(chapterId);
        $("[name='learnPlanID']").val(id);
        var time = window.moment(da.beginDate).format("YYYY-MM-DD HH:mm:ss");
        $("[name='beginDate']").val(da.beginDate);
        //$('#beginDate').html(da.beginDate);
        var grade = da.grade.id;
        var subject = da.subject.id;
        if (grade && subject) {
          var condition = {
            grade: grade,
            subject: subject
          };
          $.get(config.ip + 'learn/chapters/list', condition, function (data2) {
            if (data2.code) {
              var chapter = data2.data || [];
              var one = 0;
              var two = 0;
              var three = 0;
              for (var i in da.chapter) {
                var s = da.chapter[i];
                var clevel = Number.parseInt(s.chapterLevel);
                if (clevel === 1) {
                  one = s.id;
                } else if (clevel === 2) {
                  two = s.id;
                } else if (clevel === 3) {
                  three = s.id;
                }
              }
              console.log(one, two, three, time);
              that.setState({
                list: da.taskList,
                grade: grade,
                subject: subject,
                chapter: chapter,
                selectFirst: one,
                selectSecond: two,
                selectLast: three,
                beginDate: time
              });
            } else {
              notification.error({
                message: "数据获取失败",
                description: data2.msg
              });
            }
          });
        } else {
          that.setState({list: da.taskList, grade: grade, subject: subject});
        }
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  next: function (event) {
    //var that = this;
    //var id = that.props.params.id;
    //var title = $("[name='title']").val();
    //var description = $('#description').val();

    $.post('/learn/activity/update', $("#activityForm").serialize(), function (data) {
      if (data.code) {
        $('#basic').addClass('hidden');
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
  },
  del(i){
    var list = this.state.list;
    list.splice(i, 1);
    this.setState({list: list});
  },
  selectGrade: function (id) {
    $("[name='gradeID']").val(id);
    this.setState({grade: id});
    var that = this;
    if (this.state.subject) {
      var condition = {
        grade: id,
        subject: this.state.subject
      };
      $.get(config.ip + 'learn/chapters/list', condition, function (data) {
        if (data.code) {
          var list = data.data || [];
          console.log(list);
          that.setState({
            chapter: list, selectFirst: 0,
            selectSecond: 0,
            selectLast: 0
          });
        } else {
          notification.error({
            message: "数据获取失败",
            description: data.msg
          });
        }
      });
    }
  },
  selectSubject: function (id) {
    $("[name='subjectID']").val(id);
    this.setState({subject: id});
    var that = this;
    if (this.state.grade) {
      var condition = {
        grade: this.state.grade,
        subject: id
      };
      $.get(config.ip + 'learn/chapters/list', condition, function (data) {
        if (data.code) {
          var list = data.data || [];
          console.log(list);
          that.setState({
            chapter: list, selectFirst: 0,
            selectSecond: 0,
            selectLast: 0
          });
        } else {
          notification.error({
            message: "数据获取失败",
            description: data.msg
          });
        }
      });
    }
  },
  selectChapter: function (id, level) {
    $("[name='chapterID']").val(id);
    level = Number.parseInt(level);
    if (level === 1) {
      this.setState({selectFirst: id, selectSecond: 0, selectLast: 0});
    } else if (level === 2) {
      this.setState({selectSecond: id, selectLast: 0});
    } else if (level === 3) {
      this.setState({selectLast: id});
    }
  },
  handleDateChange: function (value) {
    console.log(new Date(value.getTime()));
    $("[name='beginDate']").val(value.getTime());
    var time = window.moment(value.getTime()).format("YYYY-MM-DD HH:mm:ss");
    this.setState({
      beginDate: time
    });
  },
  render: function () {
    var id = this.props.params.id;
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
                            <span className="ant-breadcrumb-link">编辑活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large" id="basic">
            <div className="title"><i className="fa fa-windows"></i> 基本信息</div>
            <form id="activityForm" className="form-horizontal col-md-12">
              <input ref="learnPlanID" type="hidden" name="learnPlanID"/>

              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input name="title" type="text" className="form-control lg"/>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cogs"></i> 年级</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <GradeSelect select={this.state.grade} choose={this.selectGrade}/>
                  </div>
                  <input ref="grade" type="hidden" name="gradeID"/>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-leaf"></i> 学科</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <SubjectSelect select={this.state.subject} choose={this.selectSubject}/>
                  </div>
                  <input ref="subject" type="hidden" name="subjectID"/>
                </div>
              </div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cubes"></i> 章节</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <ChapterSelect chapter={this.state.chapter}
                                   selectFirst={this.state.selectFirst}
                                   selectSecond={this.state.selectSecond}
                                   selectLast={this.state.selectLast}
                                   choose={this.selectChapter}/>
                  </div>
                </div>
                <input ref="chapter" type="hidden" name="chapterID"/>
              </div>


              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-calendar"></i> 开始日期</label>
                <input ref="beginDate" type="hidden" name="beginDate"/>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <Datepicker showTime={true} value={this.state.beginDate}
                              onSelect={this.handleDateChange} format="yyyy-MM-dd HH:mm:ss"/>
                </div>
              </div>
              <div className="clearfix"></div>
              <div className="form-group col-md-6 col-sm-12 col-xs-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 描述</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                                            <textarea id="description" name="description" className="form-control"
                                                      rows="5"></textarea>
                </div>
              </div>
              <div className="clearfix"></div>
              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                <button onClick={this.next} className="btn bg-green pull-right" type="button"><i
                  className="fa fa-arrow-right">
                  保存</i></button>
              </div>
            </form>
          </div>
          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 任务</div>
            <Task.ActivityTasks list={this.state.list} node={id} update/>
          </div>
        </div>
      </div>
    );
  }
});


/**
 * 批阅列表--任务
 * @type {*|Function}
 */
Activity.Deal = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      classList: []
    };
  },
  componentDidMount: function () {
    var id = this.props.params.id;
    var that = this;
    $.get(config.ip + 'learn/learnplans/get', {id: id}, function (data) {
      if (data.code) {
        var da = data.data;
        console.log(da);
        that.setState({list: da.taskList});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    //如果有班级id，直接跳转
  },
  detail: function (node) {
    var aid = this.props.params.id;
    this.history.pushState(null, '/activity/member/' + node.id, {aid: aid, type: node.classification});
  },
  chart: function (node) {
    var aid = this.props.params.id;
    this.history.pushState(null, '/activity/task/chart/' + node.id, {aid: aid, type: node.classification});
  },
  render: function () {
    let { query } = this.props.location;
    var id = this.props.params.id;
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">活动</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">批阅活动单</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-windows"></i> 基本信息</div>
            <div className="row">
              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <div className="col-md-10 col-sm-10 col-xs-12">
                  {query.title}
                </div>
              </div>
              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                <label className="control-label col-md-2 col-sm-2 col-xs-12"><i
                  className="fa fa-comments"></i> 描述</label>

                <div className="col-md-10 col-sm-10 col-xs-12">
                  {query.description}
                </div>
              </div>
            </div>
            <div className="row">
              <Task.ActivityTasks list={this.state.list} deal={this.detail} chart={this.chart} node={id}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


module.exports = Activity;
