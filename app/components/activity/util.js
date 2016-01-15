/**
 * Created by Administrator on 2015/7/28.
 */
var React = require('react');
var Util = {};
import { History } from 'react-router';
var img = require('../../images/img.jpg');
var config = require('../config');
var Tip = require('../Tip');
var notification = require('antd/lib/notification');
var Modal = require('antd/lib/modal');
var confirm = Modal.confirm;
var Tabs = require('antd/lib/tabs');
var TabPane = Tabs.TabPane;
var Badge = require('antd/lib/badge');
var Table = require('antd/lib/table');

/**
 * 活动单列表
 * @type {*|Function}
 */
Util.ActivityList = React.createClass({
  mixins: [History],
  handleClick: function (i, id, event) {
    /**
     * http post data
     */
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        $.post('/learn/activity/del', {id: id}, function (data) {
          if (data.code) {
            var list = that.props.list;
            list.splice(i, 1);
            that.props.updateList(list);
            //that.setState({list: list});
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
    event.stopPropagation();
  },
  handleQuery(node, event){
    this.history.pushState(null, '/activity/query/' + node.id);
    event.stopPropagation();
  },
  handleRead(node, event){
    this.history.pushState(null, '/activity/deal/' + node.id, node);
    event.stopPropagation();
  },
  handlePublish(node, event){
    if (this.props.choosePublishClass) {
      this.props.choosePublishClass(node.id);
    }
    event.stopPropagation();
  },
  handleUpdate(node, event){
    this.history.pushState(null, '/activity/update/' + node.id);
    event.stopPropagation();
  },
  renderAction: function (text, node, i) {
    if (this.props.school) {
      return (
        <div className="btn-group" role="group">
          <Tip content='详细'>
            <button onClick={this.handleQuery.bind(this, node)} className="btn btn-link"><i
              className="fa fa-search"></i></button>
          </Tip>
          <Tip content='编辑'>
            <button onClick={this.handleUpdate.bind(this, node)} type="button"
                    className="btn btn-link"><i
              className="fa fa-pencil-square-o"></i>
            </button>
          </Tip>
        </div>
      );
    } else if (this.props.deal) {
      return (
        <Tip content='批阅'>
          <button onClick={this.handleRead.bind(this, node)} className="btn btn-link"><i
            className="fa fa-pencil-square-o"></i></button>
        </Tip>
      );
    } else {
      return (
        <div className="btn-group" role="group">
          <Tip content='详细'>
            <button onClick={this.handleQuery.bind(this, node)} className="btn btn-link"><i
              className="fa fa-search"></i></button>
          </Tip>
          <Tip content='编辑'>
            <button onClick={this.handleUpdate.bind(this, node)} type="button"
                    className="btn btn-link"><i
              className="fa fa-pencil-square-o"></i>
            </button>
          </Tip>
          <Tip content='删除'>
            <button onClick={this.handleClick.bind(this, i, node.id)}
                    className="btn btn-link"><i className="fa fa-trash-o"></i></button>
          </Tip>
          <Tip content='下发'>
            <button onClick={this.handlePublish.bind(this, node)}
                    className="btn btn-link"><i className="fa fa-external-link"></i></button>
          </Tip>
        </div>
      );
    }
  },
  render: function () {
    var columns = [
      {title: '名称', dataIndex: 'title'},
      {
        title: '创建人', dataIndex: 'creator',
        render: function (text) {
          return (<div>{text.realName}</div>);
        }
      },
      {
        title: '创建时间', dataIndex: 'addDate',
        render: function (text) {
          var time = window.moment(text).format("YYYY-MM-DD");
          return (<div>{time}</div>);
        }
      },
      {title: '操作', dataIndex: '', render: this.renderAction}
    ];
    return (
      <Table columns={columns}
             dataSource={this.props.list}
             className="table" pagination={false}/>
    );
  }
});

Util.TaskList = React.createClass({
  mixins: [History],
  del: function (i, id, event) {
    /**
     * http post data
     */
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        $.post('/learn/activity/del/task', {id: id}, function (data) {
          if (data.code) {
            that.props.del(i);
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

    event.stopPropagation();
  },
  update: function (node, event) {
    this.history.pushState(null, '/activity/task/update/' + node.id, {type: node.classification});
    event.stopPropagation();
  },
  deal: function (node, event) {
    this.props.deal(node);
    event.stopPropagation();
  },
  chart: function (node, event) {
    this.props.chart(node);
    event.stopPropagation();
  },
  renderAction: function (text, node, i) {
    if (this.props.update) {
      return (
        <div className="btn-group" role="group">
          <Tip content='编辑'>
            <button onClick={this.update.bind(this, node)} type="button"
                    className="btn btn-link"><i
              className="fa fa-pencil-square-o"></i>
            </button>
          </Tip>
          <Tip content='删除'>
            <button onClick={this.del.bind(this, i, node.id)} className="btn btn-link"><i
              className="fa fa-trash-o"></i></button>
          </Tip>
        </div>
      );
    } else if (this.props.deal) {
      var chart;
      if (Number.parseInt(node.classification) === 1) {
        chart = <Tip content='统计'>
          <button onClick={this.chart.bind(this, node)} type="button" className="btn btn-link"><i
            className="fa fa-bar-chart"></i>
          </button>
        </Tip>;
      }
      return (
        <div className="btn-group" role="group">
          <Tip content='批阅'>
            <button onClick={this.deal.bind(this, node)} type="button" className="btn btn-link"><i
              className="fa fa-pencil-square-o"></i>
            </button>
          </Tip>
          {chart}
        </div>
      );
    } else if (this.props.detail) {
      return (
        <div></div>
      );
    } else {
      return (
        <div></div>
      );
    }
  },
  render: function () {
    var columns = [
      {
        title: '编号', dataIndex: 'index',
        render: function (text, node, index) {
          console.log(node, index);
          return (<div>{index + 1}</div>);
        }
      },
      {title: '名称', dataIndex: 'title'},
      {
        title: '任务类型', dataIndex: 'classification',
        render: function (text) {
          if (Number.parseInt(text) === 0) {
            return (<div>主观题</div>);
          } else {
            return (<div>客观题</div>);
          }
        }
      },
      {
        title: '执行时间', dataIndex: 'finishDate',
        render: function (text) {
          var time = window.moment(text).format("YYYY-MM-DD");
          return (<div>{time}</div>);
        }
      },
      {
        title: '创建时间', dataIndex: 'addDate',
        render: function (text) {
          var time = window.moment(text).format("YYYY-MM-DD");
          return (<div>{time}</div>);
        }
      },
      {title: '操作', dataIndex: '', render: this.renderAction}
    ];

    return (
      <Table columns={columns}
             dataSource={this.props.list}
             className="table" pagination={false}/>
    );
  }
});

Util.Exercise = React.createClass({
  componentDidMount: function () {
  },
  handleChange: function (record, e) {
    console.log(e.target.value, e.target.checked);
    this.props.choice(e.target.value, record);
  },
  del: function (i, node, event) {
    var that = this;
    that.props.del(i);
    event.stopPropagation();
  },
  query: function (node, event) {
    if (this.props.query) {
      this.props.query(node);
    }
    event.stopPropagation();
  },
  renderAction: function (text, record, index) {
    if (this.props.update) {
      return (
        <div className="btn-group">
          <Tip content='详细'>
            <button onClick={this.query.bind(this, record)} type="button"
                    className="btn btn-link"><i className="fa fa-search"></i></button>
          </Tip>
          <Tip content='删除'>
            <button onClick={this.del.bind(this, index, record)} type="button"
                    className="btn btn-link">
              <i className="fa fa-trash-o"></i>
            </button>
          </Tip>
        </div>
      );
    } else {
      return (
        <div className="btn-group">
          <Tip content='详细'>
            <button onClick={this.query.bind(this, record)} type="button"
                    className="btn btn-link"><i className="fa fa-search"></i></button>
          </Tip>
        </div>
      );
    }
  },
  renderSelect: function (text, record) {
    return (
      <div>
        <input type="radio" name="quiz"
               value={record.id}
               onChange={this.handleChange.bind(this, record)}/>
      </div>
    );
  },
  expandedRowRender: function (record) {
    return (<div dangerouslySetInnerHTML={{__html: record.title}}/>);
  },
  render: function () {
    var columns = [
      {title: '', dataIndex: '', render: this.renderSelect},
      {
        title: '题干', dataIndex: 'title',
        render: function (text) {
          return <div style={{textOverflow: 'ellipsis', height: '20px'}}
                      dangerouslySetInnerHTML={{__html: text}}/>;
        }
      },
      {
        title: '难度', dataIndex: 'degree',
        render: function (text) {
          if (Number.parseInt(text) === 1) {
            return (<div>简单</div>);
          } else if (Number.parseInt(text) === 2) {
            return (<div>一般</div>);
          } else if (Number.parseInt(text) === 3) {
            return (<div>困难</div>);
          }
          return (<div>未知</div>);
        }
      },
      {
        title: '题型', dataIndex: 'type',
        render: function (text) {
          if (Number.parseInt(text) === 1) {
            return (<div>单选</div>);
          } else if (Number.parseInt(text) === 2) {
            return (<div>多选</div>);
          } else if (Number.parseInt(text) === 0) {
            return (<div>判断</div>);
          }
          return (<div>未知</div>);
        }
      },
      {
        title: '添加时间', dataIndex: 'addDate',
        render: function (text) {
          var time = window.moment(text).format("YYYY-MM-DD");
          return (<div>{time}</div>);
        }
      },
      {
        title: '修改时间', dataIndex: 'updateDate',
        render: function (text) {
          var time = window.moment(text).format("YYYY-MM-DD");
          return (<div>{time}</div>);
        }
      },
      {
        title: '分值', dataIndex: 'score'
      },
      {title: '操作', dataIndex: '', render: this.renderAction}
    ];
    return (
      <Table columns={columns}
             dataSource={this.props.list}
             expandedRowRender={this.expandedRowRender}
             className="table" pagination={false}/>
    );
  }
});

/**
 * 成员列表View
 * @type {*|Function}
 */
Util.Member = React.createClass({
  mixins: [History],
  componentWillUnmount: function () {
    if (this.chat) {
      this.chat.destroy();
    }
  },
  getInitialState: function () {
    return {
      cid: 0,
      list: []
    };
  },
  handleClick: function (stuid) {
    var taskId = this.props.taskId;
    var type = this.props.type;
    var aid = this.props.aid;
    console.log(taskId, this.state.cid, aid);
    if (Number.parseInt(type) === 1) {
      this.history.pushState(null, '/activity/task/quiz/' + taskId, {
        uid: stuid,
        cid: this.state.cid,
        aid: aid,
        type: type
      });
    } else {
      this.history.pushState(null, '/activity/task/query/' + taskId, {
        uid: stuid,
        cid: this.state.cid,
        aid: aid,
        type: type
      });
    }
  },
  componentDidUpdate: function () {
    var cid = Number.parseInt(this.props.cid);
    var taskId = this.props.taskId;
    var that = this;
    var taskType = this.props.type;
    console.log(taskId, cid, taskType);
    if (cid) {
      if (cid !== Number.parseInt(this.state.cid)) {
        if (Number.parseInt(taskType) === 1) {
          console.log(taskType);
          $.get(config.ip + 'learn/activity/query/task/classInfo', {
            classID: cid,
            taskID: taskId,
            type: taskType
          }, function (data) {
            if (data.code) {
              var list = data.data;
              console.log('classInfo', list);

              that.setState({list: list.studentOverviewEntities, cid: cid});
              if (that.chat) {
                that.chat.destroy();
                that.chat = null;
              }
              if (list.excellentNum + list.goodmNum + list.mediumNum + list.passNum + list.badNum) {
                var chartData = [
                  ['优秀', list.excellentNum],
                  ['良好', list.goodmNum],
                  ['中等', list.mediumNum],
                  ['及格', list.passNum],
                  {
                    name: '不及格',
                    y: list.badNum,
                    sliced: true,
                    selected: true
                  }
                ];
                that.chat = new window.Highcharts.Chart({                   //图表展示容器，与div的id保持一致
                  chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    renderTo: 'memberChart',
                  },
                  credits: {
                    enabled: false
                  },
                  title: {
                    text: '班级答题统计'
                  },
                  tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                  },
                  plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                      }
                    }
                  },
                  series: [{
                    type: 'pie',
                    name: '比例',
                    data: chartData
                  }]
                });
              }
            } else {
              notification.error({
                message: "数据获取失败",
                description: data.msg
              });
            }
          });
        } else {
          $.get(config.ip + 'learn/activity/query/task/classInfo', {
            classID: cid,
            taskID: taskId,
            type: taskType
          }, function (data) {
            if (data.code) {
              var list = data.data;
              console.log('classInfo', list);

              that.setState({list: list.taskOverviewResponseEntities, cid: cid});
              if (that.chat) {
                that.chat.destroy();
                that.chat = null;
              }
              if (list.markingOne + list.markingTwo + list.markingThree + list.markingForth + list.markingFive) {
                var chartData = [
                  ['1颗星', list.markingOne],
                  ['2颗星', list.markingTwo],
                  ['3颗星', list.markingThree],
                  ['4颗星', list.markingForth],
                  {
                    name: '5颗星',
                    y: list.markingFive,
                    sliced: true,
                    selected: true
                  }
                ];
                that.chat = new window.Highcharts.Chart({                   //图表展示容器，与div的id保持一致
                  chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    renderTo: 'memberChart',
                  },
                  title: {
                    text: '班级答题统计'
                  },
                  tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                  },
                  plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                      }
                    }
                  },
                  series: [{
                    type: 'pie',
                    name: '比例',
                    data: chartData
                  }]
                });
              }
            } else {
              notification.error({
                message: "数据获取失败",
                description: data.msg
              });
            }
          });
        }
      }
    }
  },
  render: function () {
    return (
      <div>
        <div id="memberChart">
        </div>
        <div>
          {this.state.list.map(function (node) {
            var headIcon = img;
            if (node.student.headIcon) {
              if (node.student.headIcon !== '') {
                headIcon = '/learn' + node.student.headIcon;
              }
            }
            return (
              <div onClick={this.handleClick.bind(this, node.student.id)} key={node.student.id}
                   className="col-md-2 col-sm-3 col-xs-6 team-member">
                <Badge count={node.feedBackNum}>
                  <img src={headIcon} className="img-responsive img-circle" alt=""/>
                </Badge>

                <p className="text-muted">{node.student.realName}</p>
              </div>
            );
          }, this) }
        </div>
      </div>
    );
  }
});

/**
 * 班级列表View
 * @type {*|Function}
 */
Util.ClassMember = React.createClass({
  mixins: [History],
  handleClick: function (cid) {
    this.props.changeClass(cid);
  },
  getInitialState: function () {
    return {
      list: []
    };
  },
  componentDidMount: function () {

  },
  render: function () {
    if (this.props.taskId) {
      var clsList = this.props.cls;
      console.log('ClassMember', clsList);
      var content;
      if (clsList.length) {
        content = clsList.map(function (node) {
          return (
            <TabPane tab={node.className}
                     key={node.classID}></TabPane>
          );
        }, this);
        return (
          <div>
            <Tabs onChange={this.handleClick}>{content}</Tabs>
          </div>
        );
      } else {
        return (<div></div>);
      }
    } else {
      return (<div></div>);
    }
  }
});


Util.Feeds = React.createClass({
  render: function () {
    return (
      <div>
        {
          this.props.list.map(function (node, i) {
              return (
                <div key={node.feedbackID}>
                  <div><span>{i + 1}.</span>{node.content}:</div>
                  <Util.Attachments list={node.attachmentList}/>
                </div>
              );
            }, this
          )
        }
      </div>
    );
  }
});

Util.Attachments = React.createClass({
  del: function (id, node) {
    this.props.del(id, node);
  },
  render: function () {
    var list = this.props.list || [];
    if (list.length) {
      if (this.props.update) {
        return (
          <div className="ui list">
            {
              list.map(function (node, i) {
                  var id = i;
                  if (node.id) {
                    id = node.id;
                  }
                  var format = node.format;
                  return (
                    <div className="item" key={id}>
                      <div className="content">
                        <Tip content='删除'>
                          <button onClick={this.del.bind(this, i, node)} type="button"
                                  className="btn btn-link icon green">
                            <i className="fa fa-times"></i>
                          </button>
                        </Tip>
                        <a href={"/learn" + node.url} target="_blank"><Util.Icon
                          type={format}/> {node.title}</a>
                      </div>
                    </div>
                  );
                }, this
              )
            }
          </div>
        );
      } else {
        return (
          <div className="ui list">
            {
              list.map(function (node, i) {
                  var id = i;
                  if (node.id) {
                    id = node.id;
                  }
                  var format = node.format;
                  return (
                    <div className="item" key={id}>
                      <div className="content">
                        <a href={"/learn" + node.url} target="_blank"><Util.Icon
                          type={format}/> {node.title}</a>
                      </div>
                    </div>
                  );
                }, this
              )
            }
          </div>
        );
      }
    } else {
      return (<div></div>);
    }
  }
});

Util.Icon = React.createClass({
  render: function () {
    var type = this.props.type || 0;
    var key = Number.parseInt(type);
    if (key === 0) {
      return (<i className="fa fa-file-text-o"></i>);
    } else if (key === 1) {
      return (<i className="fa fa-file-image-o"></i>);
    } else if (key === 2) {
      return (<i className="fa fa-file-word-o"></i>);
    } else if (key === 3) {
      return (<i className="fa fa-file-pdf-o"></i>);
    } else if (key === 4) {
      return (<i className="fa fa-file-powerpoint-o"></i>);
    } else if (key === 5) {
      return (<i className="fa fa-file-video-o"></i>);
    } else if (key === 6) {
      return (<i className="fa fa-file-audio-o"></i>);
    } else {
      return (<i className="fa fa-file-text-o"></i>);
    }
  }
});

Util.ChartQuiz = React.createClass({
  componentDidMount: function () {
    var that = this;
    var id = this.props.taskID;
    var cid = this.props.classID;
    $.get(config.ip + 'learn/activity/query/task/questionInfo', {taskID: id, classID: cid}, function (data) {
      if (data.code) {
        var statistics = data.data;
        var questions = statistics.questionCorrectStatistics || [];
        var num = [];
        var count = [];
        that.props.updateQuestion(questions);
        for (var i in questions) {
          var question = questions[i];
          num.push(Number.parseInt(i) + 1);
          count.push(question.correctNum);
        }
        if (that.chat) {
          that.chat.destroy();
          that.chat = null;
        }
        that.chat = new window.Highcharts.Chart({                   //图表展示容器，与div的id保持一致
          chart: {
            renderTo: 'quiz',
            type: 'column'                         //指定图表的类型，默认是折线图（line）
          },
          credits: {
            enabled: false
          },
          title: {
            text: '任务统计'      //指定图表标题
          },
          xAxis: {
            categories: num   //指定x轴分组
          },
          yAxis: {
            title: {
              text: null                  //指定y轴的标题
            }
          },
          series: [{                                 //指定数据列
            name: '正确人数',                          //数据列名
            data: count                        //数据
          }]
        });
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  detail: function (index) {
    this.props.detail(index);
  },
  componentWillUnmount: function () {
    if (this.chat) {
      this.chat.destroy();
    }
  },
  render: function () {
    return (<div id="quiz"></div>);
  }
});

Util.ChartQues = React.createClass({
  getInitialState: function () {
    return {
      qid: 0
    };
  },
  componentDidMount: function () {

  },
  componentDidUpdate: function () {
    var current = this.props.current;
    var qid = current.id;
    if (qid) {
      if (Number.parseInt(qid) !== Number.parseInt(this.state.qid)) {
        if (this.chat) {
          this.chat.destroy();
          this.chat = null;
        }
        var type = Number.parseInt(current.type);
        var opts = current.statistics;
        var x = [];
        var y = [];
        if (opts) {
          if (type === 0) {
            if (opts.length === 2) {
              x = ['正确', '错误'];
              y = [opts[0].selectNum, opts[1].selectNum];
            } else {
              for (var i in opts) {
                x.push(String.fromCharCode(65 + parseInt(opts[i].id) - 1));
                y.push(opts[i].selectNum);
              }
            }
          } else {
            for (var j in opts) {
              x.push(String.fromCharCode(65 + parseInt(opts[j].id) - 1));
              y.push(opts[j].selectNum);
            }
          }
        }
        this.chat = new window.Highcharts.Chart({                   //图表展示容器，与div的id保持一致
          chart: {
            renderTo: 'exam',
            type: 'column'                         //指定图表的类型，默认是折线图（line）
          },
          credits: {
            enabled: false
          },
          title: {
            text: '题目统计'      //指定图表标题
          },
          xAxis: {
            categories: x   //指定x轴分组
          },
          yAxis: {
            title: {
              text: null                  //指定y轴的标题
            }
          },
          series: [{                                 //指定数据列
            name: '选择人数',                          //数据列名
            data: y                        //数据
          }]
        });
      }
    }
  },
  componentWillUnmount: function () {
    if (this.chat) {
      this.chat.destroy();
    }
  },
  render: function () {
    return (<div id="exam"></div>);
  }
});

Util.QuesContent = React.createClass({
  componentDidMount: function () {

  },
  componentWillUnmount: function () {
  },
  render: function () {
    var item = this.props.current || {};
    var opts = item.options;
    var content, right;
    var type = Number.parseInt(item.type);
    if (opts) {
      if (type === 0) {
        content = <div></div>;
      } else {
        opts = JSON.parse(opts);
        right = [];
        for (var j in opts) {
          if (opts[j].checked) {
            right.push(String.fromCharCode(65 + Number.parseInt(opts[j].id) - 1));
          }
        }
        content = opts.map(function (node, i) {
          return (
            <div key={i} className="form-group col-md-12">
              <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                className="fa fa-caret-square-o-right"></i>
                选项 {String.fromCharCode(65 + parseInt(node.id) - 1)}
              </label>

              <div>
                {node.content}
              </div>
            </div>
          );
        }, this);
      }
    }
    if (type === 0) {
      if (Number.parseInt(item.isCorrect)) {
        right = "正确";
      } else {
        right = "错误";
      }
    }
    return (
      <div className="form-group col-md-12">
        <div className="form-group col-md-12">
          {item.title}
        </div>
        {content}
        <div className="form-group col-md-12">
          正确答案： {right}
        </div>
      </div>
    );
  }
});

module.exports = Util;
