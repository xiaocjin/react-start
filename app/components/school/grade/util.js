/**
 * Created by Administrator on 2015/7/28.
 */
var React = require('react');
var Util = {};
import { History } from 'react-router';
var ClsModal = require('./clsModal');
var Tip = require('../../Tip');
var Modal = require('antd/lib/modal');
var confirm = Modal.confirm;
Util.GradeList = React.createClass({
  getInitialState(){
    return {smShow: false};
  },
  addCls: function (data) {
    if (this.state.ufn) {
      this.state.ufn(data);
    }
  },
  showClsModal: function (i, node, event) {
    var that = this;
    var cb = function (data) {
      console.log(data);
      console.log(that.props.list);
      if (that.props.list[i].cls.length) {
        data.classNo = that.props.list[i].cls[that.props.list[i].cls.length - 1].classNo + 1;
      } else {
        data.classNo = 1;
      }
      that.props.addCls(i, data);
    };
    this.setState({smShow: true, ufn: cb});
    event.stopPropagation();
  },
  closeClsModal: function () {
    this.setState({smShow: false});
  },
  handleDel: function (i, id, event) {
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        that.props.delGrade(i, id);
      },
      onCancel: function () {
      }
    });
    event.stopPropagation();
  },
  handleUpdate: function () {
    console.log('----');
  },
  render: function () {
    var ClsList = Util.ClsList;
    return (
      <div className=" col-md-8 col-md-offset-2">
        {this.props.list.map(function (node, i) {
          return (
            <div key={i} className="row">
              <div className="grade">
                <button onClick={this.handleUpdate}
                        className="btn btn-link text-white">{node.gradeName}
                </button>
                <Tip content='删除'>
                  <button onClick={this.handleDel.bind(this, i, node.gradeID)}
                          className="btn btn-link text-white x_location"><i className="fa fa-times">
                  </i></button>
                </Tip>
                <Tip content='新建班级'>
                  <button onClick={this.showClsModal.bind(this, i, node)}
                          className="btn btn-link pull-right text-white"><i
                    className="fa fa-plus">
                  </i></button>
                </Tip>
              </div>
              <ClsList list={node.cls || [] } grade={i}
                       delCls={this.props.delCls}/>
            </div>
          );
        }, this) }
        <ClsModal visible={this.state.smShow} onHide={this.closeClsModal} addCls={this.addCls}/>
      </div>
    );
  }
});

Util.ClsList = React.createClass({
  mixins: [History],
  handleClick: function (i, id, event) {
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        that.props.delCls(that.props.grade, i, id);
      },
      onCancel: function () {
      }
    });

    event.stopPropagation();
  },
  detail: function () {
    this.history.pushState(null, '/school/cls');
  },
  render: function () {
    return (
      <div className="cls">
        {this.props.list.map(function (node, i) {
          return (
            <div key={i} className="col-md-3 x_point"><a onClick={this.detail }
                                                         className="btn btn-link ">{node.clsName}</a><a
              onClick={this.handleClick.bind(this, i, node.id)}
              className="text-danger x_location"><i className="fa fa-times">
            </i></a></div>
          );
        }, this) }
      </div>
    );
  }
});

module.exports = Util;
