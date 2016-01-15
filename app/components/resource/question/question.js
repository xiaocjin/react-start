/**
 * Created by Administrator on 2015/7/23.
 */
var React = require('react');
var Question = {};
import { History } from 'react-router';
var Util = require('./util');
var PageNum = require('../../Pagination');
var GradeSelect = require('../resource').GradeSelect;
var SubjectSelect = require('../resource').SubjectSelect;
var ChapterSelect = require('../resource').ChapterSelect;
var ChapterMixin = require('../resource').ChapterMixin;
var QuestionMixin = require('./mixin').QuestionMixin;
var config = require('../../config');
var notification = require('antd/lib/notification');
var Radio = require('antd/lib/radio');
var RadioButton = Radio.Button;
var RadioGroup = Radio.Group;
var Modal = require('antd/lib/modal');
var confirm = Modal.confirm;

Question.List = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      pageNO: 1,
      totalPage: 0,
      list: []
    };
  },
  componentDidMount: function () {
    /**
     * http get data
     * @type {*[]}
     */
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
  addOne: function (type, event) {
    this.history.pushState(null, '/resource/question/add', {type: type});
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
      $.get(config.ip + 'learn/question/query/page', condition, function (data) {
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
  selectGrade: function (id) {
    this.setState({grade: id});
  },
  selectSubject: function (id) {
    this.setState({subject: id});
  },
  del: function (node) {
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        $.post('/learn/question/del', {id: node.id}, function (data) {
          if (data.code) {
            that.changePage();
          } else {
            notification.error({
              message: "数据获取失败",
              description: data.msg
            });
          }
        });
      },
      onCancel: function () {
      }
    });
  },
  query: function (node) {
    this.history.pushState(null, '/resource/question/query/' + node.id, {type: type});
  },
  update: function (node) {
    this.history.pushState(null, '/resource/question/update/' + node.id, {type: type});
  },
  render: function () {
    var QuestionList = Util.QuestionList;
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
                            <span className="ant-breadcrumb-link">题目管理</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-laptop"></i> 题目</div>
            <div className="row">
              <div className="col-md-12">
                <div className="ant-btn-group pull-right">
                  <button className="ant-btn bg-green" onClick={this.addOne.bind(this, 1)}>单选</button>
                  <button className="ant-btn bg-green" onClick={this.addOne.bind(this, 2)}>多选</button>
                  <button className="ant-btn bg-green" onClick={this.addOne.bind(this, 3)}>判断</button>
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
              <QuestionList list={this.state.list} changePage={this.changePage} del={this.del}
                            query={this.query} update={this.update}/>
              {pageNum}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

Question.Add = React.createClass({
  mixins: [History, ChapterMixin, QuestionMixin],
  getInitialState: function () {
    return {
      items: [{id: 1, checked: false, content: ''}, {id: 2, checked: false, content: ''}, {
        id: 3,
        checked: false,
        content: ''
      }, {id: 4, checked: false, content: ''}]
    };
  },
  componentDidMount: function () {
    window.tinymce.init({
      plugins: "textcolor",
      toolbar: "undo redo | forecolor | styleselect | bold italic |  alignleft aligncenter alignright | bullist numlist",
      menubar: false,
      language: "zh_CN",
      external_plugins: {
        html5image: '/tinymce/tinymce-html5image/plugin.js'
      },
      selector: "textarea"
    });
  },
  componentWillUnmount: function () {
    //$('textarea').off();
    window.tinymce.remove('textarea');
  },
  addNew: function (event) {
    /**
     * http post data
     */
    var that = this;
    var items = this.state.items;
    window.tinymce.triggerSave();
    $('#items').val(JSON.stringify(items));
    $.post('/learn/question/add', $("#questionForm").serialize(), function (data) {
      if (data.code) {
        that.history.pushState(null, '/resource/question');
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
    let { query } = this.props.location;
    var content;
    var type = Number.parseInt(query.type);
    if (type === 1) {
      content = <Util.Single update items={this.state.items} addOption={this.addOption}
                             delOption={this.delOption} handleChange={this.handleChange}/>;
    } else if (type === 2) {
      content = <Util.Multi update items={this.state.items} addOption={this.addOption}
                            delOption={this.delOption} handleChange={this.handleChange}/>;
    } else {
      content = <Util.Judge items={this.state.items} handleChange={this.handleChange}/>;
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
                            <span className="ant-breadcrumb-link">题目管理</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-laptop"></i> 添加题目</div>
            <form id="questionForm" className="ant-form-horizontal col-md-9">

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
                  className="fa fa-level-up"></i> 难度</label>

                <div className="col-md-9 col-sm-9 col-xs-12 control-label-text">
                  <RadioGroup onChange={this.onDegreeChange} defaultValue="1">
                    <RadioButton value="1">简单</RadioButton>
                    <RadioButton value="2">一般</RadioButton>
                    <RadioButton value="3">困难</RadioButton>
                  </RadioGroup>
                  <input ref="degree" type="hidden" name="degree" defaultValue="1"/>
                </div>
              </div>
              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 题干</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea name="title" className="form-control" rows="8"></textarea>
                </div>
              </div>

              {content}

              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 解析</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea name="analysis" className="form-control" rows="8"></textarea>

                </div>
              </div>
              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-gift"></i> 分值</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input type="text" name="score"
                         className="form-control lg"/>
                </div>
              </div>
              <input id="items" type="hidden" name="items"/>

              <div className="clearfix"></div>

              <div>
                <button onClick={this.addNew} className="btn bg-green pull-right"
                        type="button"><i className="fa fa-upload">
                  确定</i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

Question.Update = React.createClass({
  getInitialState: function () {
    return {
      degree: 0,
      items: []
    };
  },
  mixins: [History, ChapterMixin, QuestionMixin],
  componentDidMount: function () {
    window.tinymce.init({
      plugins: "textcolor",
      toolbar: "undo redo | forecolor | styleselect | bold italic |  alignleft aligncenter alignright | bullist numlist",
      menubar: false,
      language: "zh_CN",
      external_plugins: {
        html5image: '/tinymce/tinymce-html5image/plugin.js'
      },
      selector: "textarea"
    });
    var that = this;
    var id = that.props.params.id;
    let { query } = this.props.location;
    $.get(config.ip + 'learn/question/get', {id: id, type: query.type}, function (data) {
      if (data.code) {
        var da = data.data;
        console.log(da);
        $("[name='id']").val(da.id);
        $("[name='score']").val(da.score);
        $("[name='gradeID']").val(da.gradeID);
        $("[name='subjectID']").val(da.subjectID);
        $("[name='chapterID']").val(da.chapterID);
        $("[name='grade']").html(da.gradeName);
        $("[name='subject']").html(da.subjectName);
        $("[name='chapter']").html(da.chapterName);
        $("[name='degree']").val(da.degree);
        //$('#analysis').html(da.analysis);
        //$('#title').html(da.title);
        console.log(da.degree);
        window.tinymce.editors[0].setContent(da.title);
        window.tinymce.editors[1].setContent(da.analysis);
        var items;
        if (Number.parseInt(query.type)) {
          if (da.options) {
            items = JSON.parse(da.options);
          } else {
            items = [];
          }
        } else {
          if (da.isCorrect) {
            items = [{id: 1, checked: true, content: ''}, {id: 2, checked: false, content: ''}];
          } else {
            items = [{id: 1, checked: false, content: ''}, {id: 2, checked: true, content: ''}];
          }
        }
        that.setState({degree: da.degree + "", items: items});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  componentWillUnmount: function () {
    //$('textarea').off();
    window.tinymce.remove('textarea');
  },
  update: function (event) {
    /**
     * http post data
     */
    var that = this;
    var items = this.state.items;
    window.tinymce.triggerSave();
    $('#items').val(JSON.stringify(items));
    $.post('/learn/question/update', $("#questionForm").serialize(), function (data) {
      if (data.code) {
        that.history.pushState(null, '/resource/question');
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
  },
  onChange: function (e) {
    var value = e.target.value;
    $("[name='degree']").val(value);
    this.setState({degree: value});
  },
  render: function () {
    let { query } = this.props.location;
    var content;
    var type = Number.parseInt(query.type);
    if (type === 1) {
      content = <Util.Single update items={this.state.items} addOption={this.addOption}
                             delOption={this.delOption} handleChange={this.handleChange}/>;
    } else if (type === 2) {
      content = <Util.Multi update items={this.state.items} addOption={this.addOption}
                            delOption={this.delOption} handleChange={this.handleChange}/>;
    } else {
      content = <Util.Judge items={this.state.items} handleChange={this.handleChange}/>;
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
                            <span className="ant-breadcrumb-link">题目管理</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-laptop"></i> 更新题目</div>
            <form id="questionForm" className="ant-form-horizontal col-md-9">
              <input type="hidden" name="id"/>
              <input type="hidden" name="gradeID"/>
              <input type="hidden" name="subjectID"/>
              <input type="hidden" name="chapterID"/>

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
                  className="fa fa-level-up"></i> 难度</label>

                <div className="col-md-9 col-sm-9 col-xs-12 control-label-text">
                  <RadioGroup onChange={this.onChange} value={this.state.degree}>
                    <RadioButton value="1">简单</RadioButton>
                    <RadioButton value="2">一般</RadioButton>
                    <RadioButton value="3">困难</RadioButton>
                  </RadioGroup>
                  <input ref="degree" type="hidden" name="degree"/>
                </div>
              </div>
              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 题干</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea name="title" className="form-control" rows="8"></textarea>
                </div>
              </div>

              {content}

              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 解析</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea name="analysis" className="form-control" rows="8"></textarea>

                </div>
              </div>
              <div className="ant-form-item col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-gift"></i> 分值</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input type="text" name="score"
                         className="form-control lg"/>
                </div>
              </div>
              <input id="items" type="hidden" name="items"/>

              <div className="clearfix"></div>

              <div>
                <button onClick={this.update} className="btn bg-green pull-right"
                        type="button"><i className="fa fa-upload">
                  确定</i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

Question.Detail = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      question: {},
      items: []
    };
  },
  componentDidMount: function () {
    var that = this;
    var id = that.props.params.id;
    let { query } = this.props.location;
    $.get(config.ip + 'learn/question/get', {id: id, type: query.type}, function (data) {
      if (data.code) {
        var da = data.data;
        var items;
        if (Number.parseInt(query.type)) {
          if (da.options) {
            items = JSON.parse(da.options);
          } else {
            items = [];
          }
        } else {
          if (da.isCorrect) {
            items = [{id: 1, checked: true, content: ''}, {id: 2, checked: false, content: ''}];
          } else {
            items = [{id: 1, checked: false, content: ''}, {id: 2, checked: true, content: ''}];
          }
        }
        that.setState({question: da, items: items});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  update: function (event) {
    /**
     * http post data
     */
    this.history.pushState(null, '/resource/question');
    event.stopPropagation();
  },
  render: function () {
    let { query } = this.props.location;
    var content, degree;
    var type = Number.parseInt(query.type);
    if (type === 1) {
      content = <Util.Single items={this.state.items}/>;
    } else if (type === 2) {
      content = <Util.Multi items={this.state.items}/>;
    } else {
      content = <Util.Judge items={this.state.items}/>;
    }
    if (this.state.question.degree === 2) {
      degree = '一般';
    } else if (this.state.question.degree === 3) {
      degree = '困难';
    } else {
      degree = '简单';
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
                            <span className="ant-breadcrumb-link">题目管理</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-laptop"></i> 题目信息</div>
            <form className="ant-form-horizontal col-md-9">

              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cogs"></i> 年级</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  {this.state.question.gradeName}
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-leaf"></i> 学科</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  {this.state.question.subjectName}
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-cubes"></i> 章节</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  {this.state.question.chapterName}
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-level-up"></i> 难度</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  {degree}
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square"></i> 题干</label>

                <div className="col-md-9 col-sm-9 col-xs-12"
                     dangerouslySetInnerHTML={{__html: this.state.question.title}}>
                </div>
              </div>
              {content}
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-comments"></i> 解析</label>

                <div className="col-md-9 col-sm-9 col-xs-12"
                     dangerouslySetInnerHTML={{__html: this.state.question.analysis}}>
                </div>
              </div>
              <div className="ant-form-item ant-form-item-compact col-md-12">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-gift"></i> 分值</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  {this.state.question.score}
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Question;
