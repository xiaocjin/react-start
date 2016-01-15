/**
 * Created by Administrator on 2015/11/12.
 */
var React = require('react');
var Version = {};
import { History } from 'react-router';
var PageNum = require('../Pagination');
var notification = require('antd/lib/notification');
var config = require('../config');
var Table = require('antd/lib/table');
var Select = require('antd/lib/select');
var Option = Select.Option;
var Tip = require('../Tip');
var Modal = require('antd/lib/modal');
var confirm = Modal.confirm;
var Tabs = require('antd/lib/tabs');
var TabPane = Tabs.TabPane;
var Uploader = require('../upload/headUpload.js');

Version.List = React.createClass({
  getInitialState: function () {
    return {
      list: [],
      page: 0,
      totalPage: 0
    };
  },
  changePage: function (page) {
    if (page) {
      this.find(page);
    }
  },
  componentDidMount: function () {
    this.find(1);
  },
  find: function (page) {
    var condition = {};
    if (page) {
      condition.pageNO = page;
    } else {
      condition.pageNO = 1;
    }
    condition.pageSize = 10;
    var that = this;
    $.get(config.ip + 'learn/version/query/page', condition, function (data) {
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
  handleDel: function (id, event) {
    var that = this;
    confirm({
      title: '您是否确认要删除这项内容',
      onOk: function () {
        $.post('/learn/version/del', {id: id}, function (data) {
          if (data.code) {
            that.find();
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
        <Tip content='删除'>
          <button onClick={this.handleDel.bind(this, node.id)} type="button"
                  className="btn btn-link">
            <i className="fa fa-trash-o"></i>
          </button>
        </Tip>
      </div>
    );
  },
  render: function () {
    var columns = [
      {
        title: '版本号', dataIndex: 'versionNumber'
      },
      {
        title: '更新包', dataIndex: 'url',
        render: function (text) {
          if (text) {
            return <a target="_blank" href={text}>下载</a>;
          }
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
        title: '适用平台', dataIndex: 'platform',
        render: function (text) {
          var val = '';
          if (text === 1) {
            val = 'Android';
          } else if (text === 2) {
            val = 'IOS';
          }
          return (<div>{val}</div>);
        }
      },
      {title: '操作', dataIndex: '', render: this.renderAction}
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
                            <span className="ant-breadcrumb-link">版本信息</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-spinner"></i> 版本信息</div>
            <div className="row">
              <Table columns={columns}
                     dataSource={this.state.list}
                     className="table" pagination={false}/>
              <PageNum total={this.state.totalPage} current={this.state.page}
                       changePage={this.changePage}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

Version.Add = React.createClass({
  mixins: [History],
  confirm: function (event) {
    var that = this;
    $.post('/learn/version/add', $("#noticeForm").serialize(), function (data) {
      if (data.code) {
        that.history.pushState(null, '/version');
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
  },
  componentDidMount: function () {
    this.up = new Uploader();
    var loader = this.up.getLoader();
    loader.on('fileSuccess', function (file, message) {
      var m = JSON.parse(message);
      console.log(m, file);
      $("[name='url']").val(m.url);
      $("#urlName").html(file.fileName);
    });
    loader.on('fileError', function (file, message) {
      notification.error({
        message: "上传失败",
        description: '无法上传文件: ' + message
      });
    });
  },
  handleChange: function (value) {
    console.log('selected ' + value);
    $("[name='platform']").val(value);
  },
  componentWillUnmount: function () {
    this.up = null;
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
                            <span className="ant-breadcrumb-link">添加版本</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="middle">
            <div className="title"><i className="fa fa-spinner"></i> 添加版本</div>
            <form id="noticeForm" className="form-horizontal col-md-9">

              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square-o"></i> 版本号</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input name="versionNumber" type="text" className="form-control"/>
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-file-text-o"></i> 适用平台</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <Select defaultValue="1" style={{width: 120}} onChange={this.handleChange}>
                    <Option value="1">Android</Option>
                    <Option value="2">IOS</Option>
                  </Select>
                  <input type="hidden" name="platform" defaultValue="1"/>
                </div>
              </div>
              <div className="form-group">
                <Tabs onChange={this.handleTab}>
                  <TabPane tab="本地上传" key={1}>
                    <div>
                      <div className="resumable-error">
                        Your browser, unfortunately, is not supported by Resumable.js. The
                        library requires support for <a
                        href="http://www.w3.org/TR/FileAPI/">the HTML5 File API</a> along
                        with <a
                        href="http://www.w3.org/TR/FileAPI/#normalization-of-params">file
                        slicing</a>.
                      </div>
                      <div className="resumable-drop"
                           ondragenter="jQuery(this).addClass('resumable-dragover');"
                           ondragend="jQuery(this).removeClass('resumable-dragover');"
                           ondrop="jQuery(this).removeClass('resumable-dragover');">
                        <a className="resumable-browse"><u>本地文件</u></a>
                      </div>
                    </div>
                    <div>
                      <span id="urlName"></span>
                    </div>
                  </TabPane>
                  <TabPane tab="外部URL" key={0}>
                    <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                      className="fa fa-file-text-o"></i> 地址</label>

                    <div className="col-md-9 col-sm-9 col-xs-12">
                      <input name="outUrl" type="text" className="form-control"/>
                    </div>
                  </TabPane>
                </Tabs>
                <input name="url" type="hidden"/>
              </div>
              <div>
                <button onClick={this.confirm} className="btn bg-green pull-right"
                        type="button"><i
                  className="fa fa-upload"> 确定</i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Version;
