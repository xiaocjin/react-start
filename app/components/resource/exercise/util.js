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
var notification = require('antd/lib/notification');
Util.ExerciseList = React.createClass({
  mixins: [History],
  handleClick: function (node, event) {
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        $.post('/learn/exercise/del', {id: node.id}, function (data) {
          if (data.code) {
            that.props.changePage();
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
  handleUpdate: function (node, event) {
    this.history.pushState(null, '/resource/exercise/update/' + node.id);
    event.stopPropagation();
  },
  handleDetail: function (node, event) {
    this.history.pushState(null, '/resource/exercise/query/' + node.id);
    event.stopPropagation();
  },
  componentDidMount: function () {

  },
  renderAction: function (text, record) {
    if (this.props.query) {
      return (
        <Tip content='详细'>
          <button onClick={this.handleDetail.bind(this, record)} className="btn btn-link"><i
            className="fa fa-search"></i></button>
        </Tip>
      );
    } else {
      return (
        <div className="btn-group">

          <Tip content='详细'>
            <button onClick={this.handleDetail.bind(this, record)} className="btn btn-link"><i
              className="fa fa-search"></i></button>
          </Tip>
          <Tip content='编辑'>
            <button onClick={this.handleUpdate.bind(this, record)} type="button"
                    className="btn btn-link"><i
              className="fa fa-pencil-square-o"></i>
            </button>
          </Tip>
          <Tip content='删除'>
            <button onClick={this.handleClick.bind(this, record)} type="button"
                    className="btn btn-link">
              <i className="fa fa-trash-o"></i>
            </button>
          </Tip>
          <Tip content='发布'>
            <button className="btn btn-link"><i className="fa fa-external-link"></i>
            </button>
          </Tip>
        </div>
      );
    }

  },
  render: function () {
    var columns = [
      {
        title: '练习名称', dataIndex: 'title',
        render: function (text) {
          return <div style={{textOverflow: 'ellipsis'}} dangerouslySetInnerHTML={{__html: text}}/>;
        }
      },
      {
        title: '学科', dataIndex: 'subjectName'
      },
      {title: '单元', dataIndex: 'chapterName'},
      {
        title: '年级', dataIndex: 'gradeName'
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
});

Util.ExerciseItemList = React.createClass({
  del: function (i, node, event) {
    var that = this;
    //confirm({
    //    title: '您是否确认要删除这项内容',
    //    onOk: function () {
    that.props.del(i);
    //    },
    //    onCancel: function () {
    //    }
    //});
    event.stopPropagation();
  },
  query: function (node, event) {
    if (this.props.query) {
      this.props.query(node);
    }
    event.stopPropagation();
  },
  handleChange: function (node, index, event) {
    if (this.props.score) {
      this.props.score(node, event.target.value, index);
    }
    //console.log(this.props, node, event.target.value, index);
    event.stopPropagation();
  },
  renderScore: function (text, record, index) {
    return (
      <input type="text" className="ant-input small" value={text}
             onChange={this.handleChange.bind(this, record, index)}/>
    );
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
  }, expandedRowRender: function (record) {
    return (<div dangerouslySetInnerHTML={{__html: record.title}}/>);
  },
  render: function () {
    var columns = [
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
        title: '分值', dataIndex: 'score', render: this.renderScore
      },
      {title: '操作', dataIndex: '', render: this.renderAction}
    ];
    var table;
    var opts = this.props.select;
    if (opts) {
      var that = this;
      var rowSelection = {
        onSelect: function (record, selected, selectedRows) {
          if (that.props.choice) {
            console.log(record, selected, selectedRows);
            that.props.choice(selectedRows);
          }
        },
        onSelectAll: function (selected, selectedRows) {
          if (that.props.choice) {
            console.log(selected, selectedRows);
            that.props.choice(selectedRows);
          }
        }
      };
      var keys = [];
      for (var i in opts) {
        keys.push(opts[i].questionID);
      }
      table = <Table columns={columns}
                     dataSource={this.props.list}
                     expandedRowRender={this.expandedRowRender}
                     rowSelection={rowSelection}
                     userSelect={keys}
                     className="table" pagination={false}/>;

    } else {
      table = <Table columns={columns}
                     dataSource={this.props.list}
                     expandedRowRender={this.expandedRowRender}
                     className="table" pagination={false}/>;
    }
    return (
      <div>{table}</div>
    );
  }
});

module.exports = Util;
