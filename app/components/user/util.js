/**
 * Created by Administrator on 2015/7/28.
 */
var React = require('react');
var Util = {};
import { History } from 'react-router';
var Tip = require('../Tip');
var config = require('../config');
var notification = require('antd/lib/notification');
var Modal = require('antd/lib/modal');
var confirm = Modal.confirm;
var Table = require('antd/lib/table');

Util.UserList = React.createClass({
  mixins: [History],
  handleUpdate: function (node, event) {
    this.history.pushState(null, '/user/update/' + node.id, {role: node.role});
    event.stopPropagation();
  },
  handleQuery: function (node, event) {
    this.history.pushState(null, '/user/detail/' + node.id, {role: node.role});
    event.stopPropagation();
  },
  handleDel: function (node, event) {
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        console.log(node.id);
        $.post('/learn/user/del', {id: node.id, role: node.role}, function (data) {
          if (data.code) {
            that.props.changePage(1);
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
  renderAction: function (text, node) {
    return (
      <div className="btn-group" role="group">
        <Tip content='详细'>
          <button onClick={this.handleQuery.bind(this, node)} type="button"
                  className="btn btn-link"><i
            className="fa fa-search"></i>
          </button>
        </Tip>
        <Tip content='编辑'>
          <button onClick={this.handleUpdate.bind(this, node)} type="button"
                  className="btn btn-link"><i
            className="fa fa-pencil-square-o"></i>
          </button>
        </Tip>
        <Tip content='删除'>
          <button onClick={this.handleDel.bind(this, node)} type="button"
                  className="btn btn-link">
            <i className="fa fa-trash-o"></i>
          </button>
        </Tip>
      </div>
    );
  },
  render: function () {
    var columns = [
      {title: '姓名', dataIndex: 'realName'},
      {
        title: '身份', dataIndex: 'role',
        render: function (text) {
          if (Number.parseInt(text) === 1) {
            return (<div>学生</div>);
          } else {
            return (<div>教师</div>);
          }
        }
      },
      {title: '手机', dataIndex: 'phone'},
      {title: '账号', dataIndex: 'username'},
      {
        title: '注册时间', dataIndex: 'addDate',
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
Util.Subject = React.createClass({
  getInitialState: function () {
    return {
      subject: []
    };
  },
  componentDidMount: function () {
    var that = this;
    $.get(config.ip + 'learn/subjects/list', function (data) {
      if (data.code) {
        var list = data.data;
        that.setState({subject: list});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  handleChange(node, event){
    console.log(event.target.checked, node);
    this.props.changeSubject(event.target.checked, node);
    if (!event.target.checked) {
      this.state.subject.push(node);
    }
    event.stopPropagation();
  },
  render: function () {
    var unSelect = this.state.subject;
    if (this.props.select.length) {
      for (var i in this.props.select) {
        var s = this.props.select[i];
        for (var j in unSelect) {
          if (s.id === unSelect[j].id) {
            unSelect.splice(j, 1);
            break;
          }
        }
      }
      return (
        <div>
          {this.props.select.map(function (node) {
            return (
              <div key={node.id} className="checkbox-inline">
                <label>
                  <input onChange={this.handleChange.bind(this, node)} name="subjectIdStr"
                         type="checkbox" checked
                         value={node.id}/> {node.subjectName}
                </label>
              </div>);
          }, this) }
          {unSelect.map(function (node) {
            return (
              <div key={node.id} className="checkbox-inline">
                <label>
                  <input onChange={this.handleChange.bind(this, node)} name="subjectIdStr"
                         type="checkbox"
                         value={node.id}/> {node.subjectName}
                </label>
              </div>);
          }, this) }
        </div>
      );
    } else {
      return (
        <div>
          {this.state.subject.map(function (node) {
            return (
              <div key={node.id} className="checkbox-inline">
                <label>
                  <input onChange={this.handleChange.bind(this, node)} name="subjectIdStr"
                         type="checkbox"
                         className="flat"
                         value={node.id}/> {node.subjectName}
                </label>
              </div>);
          }, this) }
        </div>
      );
    }

  }
});
module.exports = Util;
