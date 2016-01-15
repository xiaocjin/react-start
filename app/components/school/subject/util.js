/**
 * Created by Administrator on 2015/7/28.
 */
var React = require('react');
var Util = {};
import { History } from 'react-router';
var Tip = require('../../Tip');
var Table = require('antd/lib/table');
var Modal = require('antd/lib/modal');
var confirm = Modal.confirm;

Util.SubjectList = React.createClass({
  mixins: [History],
  handleDel: function (i, id, event) {
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        that.props.del(i, id);
      },
      onCancel: function () {
      }
    });
    event.stopPropagation();
  },
  renderAction: function (text, node, i) {
    return (
      <div className="btn-group" role="group">
        <Tip content='编辑'>
          <button onClick={this.handleUpdate.bind(this, node)} className="btn btn-link"><i
            className="fa fa-pencil-square-o"></i>
          </button>
        </Tip>
        <Tip content='删除'>
          <button onClick={this.handleDel.bind(this, i, node.id)} type="button"
                  className="btn btn-link">
            <i className="fa fa-trash-o"></i>
          </button>
        </Tip>
      </div>
    );
  },
  handleUpdate: function (node, event) {
    this.history.pushState(null, '/school/subject/update/' + node.id, node);
    event.stopPropagation();
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
      {
        title: '学科名称', dataIndex: 'subjectName'
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
      {title: '操作', dataIndex: '', render: this.renderAction}
    ];
    return (
      <Table columns={columns}
             dataSource={this.props.list}
             className="table" pagination={false}/>
    );
  }
})
;

module.exports = Util;
