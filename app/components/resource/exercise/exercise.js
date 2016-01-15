/**
 * Created by Administrator on 2015/7/23.
 */
var React = require('react');
var Exercise = {};
import { History } from 'react-router';
var Util = require('./util');
var ExerciseModal = require('./exerciseModal');
var PageNum = require('../../Pagination');
var GradeSelect = require('../resource').GradeSelect;
var SubjectSelect = require('../resource').SubjectSelect;
var ChapterSelect = require('../resource').ChapterSelect;
var config = require('../../config');
var notification = require('antd/lib/notification');
var ChapterMixin = require('../resource').ChapterMixin;

Exercise.List = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      pageNO: 1,
      totalPage: 0,
      list: []
    };
  },
  selectGrade: function (id) {
    this.setState({grade: id});
  },
  selectSubject: function (id) {
    this.setState({subject: id});
  },
  componentDidMount: function () {
    let { query } = this.props.location;
    var page;
    if (query) {
      page = query.page || 1;
    }
    this.changePage(page);
  },
  search: function (event) {
    /**
     * http get data
     */
    this.changePage(1);
    if (event) {
      event.stopPropagation();
    }
  },
  addNew: function () {
    this.history.pushState(null, '/resource/exercise/add', {type: node.type});
    event.stopPropagation();
  },
  changePage: function (p) {
    var page = p || this.state.pageNO;
    if (page) {
      var condition = {pageNO: page};
      if (this.state.grade) {
        condition.gradeID = this.state.grade;
      }
      if (this.state.subject) {
        condition.subjectID = this.state.subject;
      }
      condition.pageSize = 10;
      var that = this;
      $.get(config.ip + 'learn/exercise/query/page', condition, function (data) {
        if (data.code) {
          var list = data.data;
          console.log(list);
          that.setState({list: list, totalPage: data.total, pageNO: page});
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
    var ExerciseList = Util.ExerciseList;
    var pageNum;
    if (this.state.totalPage) {
      pageNum = <PageNum total={this.state.totalPage} current={this.state.pageNO} changePage={this.changePage}/>;
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
                            <span className="ant-breadcrumb-link">练习</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-laptop"></i> 练习</div>
            <div className="row">
              <div className="col-md-12">
                <div className="pull-right">
                  <button onClick={this.addNew} className="btn bg-green" type="button"><i
                    className="fa fa-plus">
                    新建练习</i></button>
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
              <div className="col-md-6 ">
                <button onClick={this.search} className="btn bg-green pull-left" type="button"><i
                  className="fa fa-search"></i>
                </button>
              </div>
            </div>
            <div className="row">
              <ExerciseList list={this.state.list} changePage={this.changePage}/>
              {pageNum}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
Exercise.Add = React.createClass({
  mixins: [History, ChapterMixin],
  next: function () {
    var that = this;
    $.post('/learn/exercise/add', $("#exerciseForm").serialize(), function (data) {
      if (data.code) {
        that.history.pushState(null, '/resource/exercise/itemList/' + data.data);
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
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
                            <span className="ant-breadcrumb-link">添加练习</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-laptop"></i> 添加练习</div>
            <form id="exerciseForm" className="ant-ant-form-horizontal col-md-9">

              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input name="title" type="text" className="form-control lg"/>
                </div>
              </div>
              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cogs"></i> 年级</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <GradeSelect choose={this.selectGrade}/>
                  </div>
                  <input ref="grade" type="hidden" name="gradeID"/>
                </div>
              </div>
              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-leaf"></i> 学科</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <SubjectSelect choose={this.selectSubject}/>
                  </div>
                  <input ref="subject" type="hidden" name="subjectID"/>
                </div>
              </div>
              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cubes"></i> 章节</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <div className="col-md-6 col-sm-12 col-xs-12" style={{padding: 0}}>
                    <ChapterSelect chapter={this.state.chapter}
                                   selectFirst={this.state.selectFirst}
                                   selectSecond={this.state.selectSecond}
                                   selectLast={this.state.selectLast}
                                   choose={this.selectChapter}/>
                    <input ref="chapter" type="hidden" name="chapterID"/>
                  </div>
                </div>
              </div>


              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 说明</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea name="description" className="form-control" rows="5"></textarea>
                </div>
              </div>
              <div className="clearfix"></div>
              <div>
                <button onClick={this.next} className="btn bg-green pull-right" type="button"><i
                  className="fa fa-arrow-right">
                  下一步</i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
var QuestionList = Util.ExerciseItemList;
Exercise.ItemList = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      mShow: false
    };
  },
  del: function (i) {
    var list = this.state.list;
    list.splice(i, 1);
    this.setState({list: list});
  },
  query: function (node) {
    this.history.pushState(null, '/resource/question/query/' + node.questionID, {type: node.type});
    window.location.reload();
    //event.stopPropagation();
  },
  score: function (node, value) {
    console.log(node, value);
  },
  componentDidMount: function () {

  },
  showModal: function () {
    this.setState({mShow: true});
  },
  addQuestion: function (data) {
    var list = this.state.list;
    //list.push添加默认选中
    var len = list.length;
    for (var i in data) {
      if (len) {
        for (var j = 0; j < len; j++) {
          if (list[j].questionID === data[i].id) {
            break;
          } else {
            if (j + 1 === len) {
              data[i].questionID = data[i].id;
              data[i].key = data[i].questionID;
              list.push(data[i]);
            }
          }
        }
      } else {
        console.log(data);
        data[i].questionID = data[i].id;
        data[i].key = data[i].questionID;
        list.push(data[i]);
      }
    }
    console.log(list);
    this.setState({list: list});
  },
  upload: function () {
    var that = this;
    var id = that.props.params.id;
    var list = this.state.list || [];
    var questions = [];
    for (var i in list) {
      questions.push({questionID: list[i].questionID, score: list[i].score});
    }
    $.post('/learn/exercise/items/update', {exerciseID: id, questions: questions}, function (data) {
      if (data.code) {
        that.history.pushState(null, '/resource/exercise');
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  render: function () {
    let smClose = () => this.setState({mShow: false});
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">练习信息</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-laptop"></i> 题目</div>

            <QuestionList update list={this.state.list} query={this.query} score={this.score}
                          del={this.del}/>

            <div className="ant-table-pagination">
              <div className="ant-table-pagination">
                <div className="ant-btn-group">
                  <button onClick={this.showModal} className="ant-btn ant-btn-primary" type="button">
                    <i className="fa fa-plus">
                      添加题目</i></button>
                </div>
                <button onClick={this.upload} className="ant-btn ant-btn-primary"
                        type="button"><i className="fa fa-upload">
                  确定</i></button>
              </div>
            </div>
          </div>

        </div>
        <ExerciseModal select={this.state.list} visible={this.state.mShow} onHide={smClose}
                       onTrue={this.addQuestion}
                       query={this.query}/>
      </div>
    );
  }
});
Exercise.Update = React.createClass({
  getInitialState: function () {
    return {
      list: [],
      mShow: false
    };
  },
  componentDidMount: function () {
    var that = this;
    var id = that.props.params.id;
    $.get(config.ip + 'learn/exercise/get', {id: id}, function (data) {
      if (data.code) {
        var da = data.data;
        console.log(da);
        $("[name='id']").val(da.id);
        $("[name='title']").val(da.title);
        $("[name='description']").html(da.description);
        $("[name='gradeID']").val(da.gradeID);
        $("[name='subjectID']").val(da.subjectID);
        $("[name='chapterID']").val(da.chapterID);
        $("[name='grade']").html(da.gradeName);
        $("[name='subject']").html(da.subjectName);
        $("[name='chapter']").html(da.chapterName);
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    $.get(config.ip + 'learn/exercise/items/query', {exerciseID: id}, function (data) {
      if (data.code) {
        var da = data.data || [];
        for (var i in da) {
          da[i].id = da[i].questionID;
          da[i].key = da[i].questionID;
        }
        that.setState({list: da});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  mixins: [History, ChapterMixin],
  showModal: function () {
    console.log('showModal');
    this.setState({mShow: true});
  },
  addQuestion: function (data) {
    var list = this.state.list;
    //list.push添加默认选中
    var len = list.length;
    for (var i in data) {
      if (len) {
        for (var j = 0; j < list.length; j++) {
          if (list[j].questionID === data[i].id) {
            break;
          } else {
            if (j + 1 === list.length) {
              data[i].questionID = data[i].id;
              data[i].key = data[i].questionID;
              list.push(data[i]);
            }
          }
        }
      } else {
        console.log(data);
        data[i].questionID = data[i].id;
        data[i].key = data[i].questionID;
        list.push(data[i]);
      }
    }
    console.log(list);
    this.setState({list: list});
  },
  del: function (i) {
    var list = this.state.list;
    list.splice(i, 1);
    this.setState({list: list});
  },
  query: function (node) {
    this.history.pushState(null, '/resource/question/query/' + node.questionID, {type: node.type});
    window.location.reload();
    //event.stopPropagation();
  },
  score: function (node, value, index) {
    var list = this.state.list;
    list[index].score = value;
    this.setState({list: list});
  },
  update: function () {
    //var that = this;
    $.post('/learn/exercise/update', $("#exerciseForm").serialize(), function (data) {
      if (data.code) {
        $('#basic').hide();
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
  },
  upload: function () {
    var that = this;
    var id = that.props.params.id;
    var list = this.state.list || [];
    var questions = [];
    for (var i in list) {
      questions.push({questionID: list[i].questionID, score: list[i].score});
    }
    $.post('/learn/exercise/items/update', {exerciseID: id, questions: questions}, function (data) {
      if (data.code) {
        that.history.pushState(null, '/resource/exercise');
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  render: function () {
    let smClose = () => this.setState({mShow: false});
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">练习信息</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div id="basic" className="large">
            <div className="title"><i className="fa fa-laptop"></i> 基本信息</div>
            <form id="exerciseForm" className="ant-ant-form-horizontal col-md-9">
              <input type="hidden" name="id"/>
              <input type="hidden" name="gradeID"/>
              <input type="hidden" name="subjectID"/>
              <input type="hidden" name="chapterID"/>

              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input name="title" type="text" className="form-control lg"/>
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cogs"></i> 年级</label>

                <div name="grade" className="col-md-9 col-sm-9 col-xs-12">
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-leaf"></i> 学科</label>

                <div name="subject" className="col-md-9 col-sm-9 col-xs-12">
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cubes"></i> 章节</label>

                <div name="chapter" className="col-md-9 col-sm-9 col-xs-12">
                </div>
              </div>
              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 说明</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea name="description" className="form-control" rows="5"></textarea>
                </div>
              </div>
              <div className="clearfix"></div>

              <div>
                <button onClick={this.update} className="btn bg-green pull-right"
                        type="button"><i className="fa fa-upload">
                  确定</i></button>
              </div>
            </form>
          </div>
          <div className="large">
            <QuestionList update list={this.state.list} query={this.query} score={this.score}
                          del={this.del}/>

            <div className="ant-table-pagination">
              <div className="ant-btn-group">
                <button onClick={this.showModal} className="ant-btn ant-btn-primary" type="button">
                  <i className="fa fa-plus">
                    添加题目</i></button>
              </div>
              <button onClick={this.upload} className="ant-btn ant-btn-primary"
                      type="button"><i className="fa fa-upload">
                确定</i></button>
            </div>
          </div>
        </div>
        <ExerciseModal select={this.state.list} visible={this.state.mShow} onHide={smClose}
                       onTrue={this.addQuestion}
                       query={this.query}/>
      </div>
    );
  }
});
Exercise.Detail = React.createClass({
  getInitialState: function () {
    return {
      list: []
    };
  },
  componentDidMount: function () {
    var that = this;
    var id = that.props.params.id;
    console.log('componentDidMount' + id);
    $.get(config.ip + 'learn/exercise/get', {id: id}, function (data) {
      if (data.code) {
        var da = data.data;
        console.log(da);
        $("[name='title']").html(da.title);
        $("[name='description']").html(da.description);
        $("[name='grade']").html(da.gradeName);
        $("[name='subject']").html(da.subjectName);
        $("[name='chapter']").html(da.chapterName);
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    $.get(config.ip + 'learn/exercise/items/query', {exerciseID: id}, function (data) {
      if (data.code) {
        var da = data.data || [];
        that.setState({list: da});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  mixins: [History, ChapterMixin],
  query: function (node) {
    this.history.pushState(null, '/resource/question/query/' + node.questionID, {type: node.type});
    window.location.reload();
    //event.stopPropagation();
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
                            <span className="ant-breadcrumb-link">练习信息</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-laptop"></i> 基本信息</div>
            <form id="exerciseForm" className="ant-ant-form-horizontal col-md-9">

              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 名称</label>

                <div name="title" className="col-md-9 col-sm-9 col-xs-12">

                </div>
              </div>

              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cogs"></i> 年级</label>

                <div name="grade" className="col-md-9 col-sm-9 col-xs-12">
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-leaf"></i> 学科</label>

                <div name="subject" className="col-md-9 col-sm-9 col-xs-12">
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cubes"></i> 章节</label>

                <div name="chapter" className="col-md-9 col-sm-9 col-xs-12">
                </div>
              </div>
              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 说明</label>

                <div name="description" className="col-md-9 col-sm-9 col-xs-12">
                </div>
              </div>
              <div className="clearfix"></div>
            </form>
          </div>
          <div className="large">
            <QuestionList list={this.state.list} query={this.query}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Exercise;
