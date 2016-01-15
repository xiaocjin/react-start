/**
 * Created by Administrator on 2015/7/23.
 */
import React from 'react';
import ReactDOM from 'react-dom';
var User = {};
import { History } from 'react-router';
var Util = require('./util');
var PageNum = require('../Pagination');
var Uploader = require('../upload/headUpload.js');
var UploadHead = require('../upload/head');
var config = require('../config');
var GradeClass = require('../school/cls/util').GradeClass;
var notification = require('antd/lib/notification');

User.List = React.createClass({
  mixins: [History],
  componentDidMount: function () {
    var role = this.props.role;
    $("[name='role']").val(role);
  },
  search: function (event) {
    this.changePage(1);
    event.stopPropagation();
  },
  addUser: function (event) {
    this.history.pushState(null, '/user/add/');
    event.stopPropagation();
  },
  changePage: function (page) {
    //条件
    if (page) {
      var phone = ReactDOM.findDOMNode(this.refs.phone).value.trim();
      var realName = ReactDOM.findDOMNode(this.refs.realName).value.trim();
      var role = ReactDOM.findDOMNode(this.refs.role).value.trim();
      var condition = {pageNO: page, role: role};
      if (realName !== '') {
        condition.realName = realName;
      }
      if (phone !== '') {
        condition.phone = phone;
      }
      condition.pageSize = 10;
      var that = this;
      $.get(config.ip + 'learn/user/query/page', condition, function (data) {
        if (data.code) {
          var list = data.data;
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
  handleChange: function (event) {
    this.role = event.target.value;
  },
  render: function () {
    var UserList = Util.UserList;

    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">用户管理</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-user-md"></i> 用户信息</div>
            <div className="row">
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-addon">手机号</span>
                  <input ref="phone" type="text" className="form-control"/>
                </div>
              </div>

              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-addon">姓名</span>
                  <input ref="realName" type="text" className="form-control"/>
                </div>
              </div>
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-addon">角色</span>
                  <select ref="role" onChange={this.handleChange} name="role"
                          className="form-control">
                    <option value="1">学生</option>
                    <option value="2">教师</option>
                    <option value="5">管理员</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 ">
                <button onClick={this.addUser} className="btn bg-green pull-right" type="button"><i
                  className="fa fa-plus">
                  新增用户</i></button>
                <button onClick={this.search} className="btn bg-green pull-left" type="button"><i
                  className="fa fa-search"></i>
                </button>
              </div>
            </div>
            <div className="row">
              <UserList list={this.props.list} changePage={this.changePage}/>
              <PageNum total={this.props.totalPage} current={this.props.page}
                       changePage={this.changePage}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

User.Add = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      selectSubject: [],
      headIcon: ''
    };
  },
  componentDidMount: function () {
    this.up = new Uploader();
    var loader = this.up.getLoader();
    loader.on('fileSuccess', function (file, message) {
      console.log(file);
      var data = {};
      var m = JSON.parse(message);
      data.url = m.url;
      data.title = file.fileName;
      console.log(data);
      //that.setState({headIcon: data.url});
      $('#headIcon').attr('src', '/learn' + data.url);
      $('#headIcon').removeClass('hidden');
      $("[name='headIcon']").val(data.url);
    });
    loader.on('fileError', function (file, message) {
      notification.error({
        message: "上传失败",
        description: '无法上传文件: ' + message
      });
    });
  },
  upload(){
    this.up.upload();
  },
  componentWillUnmount: function () {
    this.up = null;
  },
  changeSubject(flag, node){
    var list = this.state.selectSubject;
    if (flag) {
      list.push(node);
      this.setState({selectSubject: list});
    } else {
      for (var i in list) {
        if (list[i].id === node.id) {
          list.splice(i, 1);
          break;
        }
      }
      this.setState({selectSubject: list});
    }
  },
  submit: function (event) {
    /**
     * http post data
     */
    var that = this;
    var p1 = ReactDOM.findDOMNode(this.refs.password1).value.trim();
    var p2 = ReactDOM.findDOMNode(this.refs.password2).value.trim();
    var role = ReactDOM.findDOMNode(this.refs.role).value.trim();
    console.log(p1, p2, $("#userForm").serialize());
    if (p1 === p2) {
      $.post('/learn/user/add', $("#userForm").serialize(), function (data) {
        if (data.code) {
          that.history.pushState(null, '/user');
        } else {
          notification.error({
            message: "数据获取失败",
            description: data.msg
          });
        }
      });
    } else {
      notification.error({
        message: "密码错误",
        description: '密码有误，请确认密码一致！'
      });
    }
    event.stopPropagation();
  },
  handleChange: function (event) {
    //this.setState({value: event.target.value});
    if (event.target.value === '1') {
      $('.role_1').removeClass('hidden');
      $('.role_2').addClass('hidden');
    } else {
      $('.role_1').addClass('hidden');
      $('.role_2').removeClass('hidden');
    }
  },
  chooseClass: function (id) {
    $("[name='classId']").val(id);
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
                            <a className="ant-breadcrumb-link" href="#/user">用户管理</a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">新建用户</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-user-md"></i> 用户信息</div>
            <form id="userForm" className="form-horizontal">
              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-picture-o"></i> 头像</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <img id="headIcon" src="" className="img-circle profile_img hidden"/>
                  <UploadHead />
                  <input type="hidden" name="headIcon"/>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-credit-card"></i> 账号</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input type="text" name="username" className="form-control"/>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-user"></i> 姓名</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input name="realName" type="text" className="form-control"/>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-phone"></i> 手机</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input type="text" name="phone" className="form-control"/>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-key"></i> 密码</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input ref="password1" type="password" name="password"
                         className="form-control"/>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-key"></i> 确认密码</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input ref="password2" type="password" className="form-control"/>
                </div>
              </div>


              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-envelope-o"></i> 邮箱</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input type="text" name="email" className="form-control"/>
                </div>
              </div>

              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-users"></i> 角色</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <select ref='role' onChange={this.handleChange} name="role"
                          className="form-control md">
                    <option value="1">学生</option>
                    <option value="2">教师</option>
                    <option value="5">管理员</option>
                  </select>
                </div>
              </div>
              <div className="role_1 form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-cogs"></i> 所属班级</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <GradeClass chooseClass={this.chooseClass}/>
                  <input type="hidden" name="classId" className="form-control"/>
                </div>
              </div>
              <div className="role_2 hidden form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-tags"></i> 任教科目</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <Util.Subject changeSubject={this.changeSubject}
                                select={this.state.selectSubject}
                                list={this.state.subject}/>
                </div>
              </div>

              <div className="role_1 form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-user-secret"></i> 家长姓名</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input type="text" name="parentName" className="form-control"/>
                </div>
              </div>
              <div>
                <button onClick={this.submit} className="btn bg-green pull-right"
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

User.Detail = React.createClass({
  mixins: [History],
  componentDidMount: function () {
    var that = this;
    var uid = this.props.params.id;
    let { query } = this.props.location;
    var role = query.role;
    $.get(config.ip + 'learn/user/detail', {id: uid, role: role}, function (data) {
      if (data.code) {
        var node = data.data;
        node.role = role;
        that.setState({node: node});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  cpw: function (event) {
    var uid = this.props.params.id;
    this.history.pushState(null, '/user/cpw/' + uid);
    event.stopPropagation();
  },
  getInitialState: function () {
    return {
      node: {}
    };
  },
  render: function () {
    var roleNmame;
    var content;
    var role = Number.parseInt(this.state.node.role);
    if (role === 1) {
      roleNmame = "学生";
      var clsName;
      if (this.state.node.myCurrentClass) {
        //clsName = this.state.node.myCurrentClass.classData.clsName;
        var cid = 0;
        var gid = 0;
        try {
          cid = this.state.node.myCurrentClass.classData.id;
          gid = this.state.node.myCurrentClass.classData.grade.id;
        } catch (err) {
          console.log(err);
        }
        clsName = <GradeClass grade={gid}
                              select={cid}
                              disabled/>;
      }
      content = <div>
        <div className="form-group col-md-6">
          <label className="col-md-3 col-sm-3 col-xs-12"> 所属班级</label>

          <label className="col-md-9 col-sm-9 col-xs-12">
            {clsName}
          </label>
        </div>
        <div className="form-group col-md-6">
          <label className="col-md-3 col-sm-3 col-xs-12"> 家长姓名</label>

          <label className="col-md-9 col-sm-9 col-xs-12">
            {this.state.node.parentName}
          </label>
        </div>
      </div>;
    } else if (role === 2) {
      roleNmame = "教师";
      var subjects = "";
      if (this.state.node.mySubjects) {
        var subject = this.state.node.mySubjects || [];
        for (var i  in subject) {
          var t = subject[i].subjectName + '    ';
          subjects += t;
        }
      }
      content = <div className="form-group col-md-6">
        <label className="col-md-3 col-sm-3 col-xs-12"> 任教科目</label>

        <label className="col-md-9 col-sm-9 col-xs-12">
          {subjects}
        </label>
      </div>;
    } else if (role === 3) {
      roleNmame = "学科组长";
    } else if (role === 4) {
      roleNmame = "年级组长";
    } else if (role === 5) {
      roleNmame = "管理员";
    }
    var headIcon;
    if (this.state.node.headIcon) {
      headIcon =
        <img id="headIcon" src={'/learn' + this.state.node.headIcon} className="img-circle profile_img "/>;
    } else {
      headIcon = <img id="headIcon" src="" className="img-circle profile_img hidden"/>;
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
                            <a className="ant-breadcrumb-link" href="#/user">用户管理</a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">基本信息</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-user-md"></i> 用户信息</div>
            <div className="row">
              <div className="col-md-12 ">
                <button onClick={this.cpw} className="btn bg-green pull-right" type="button"><i
                  className="fa fa-pencil-square-o">
                  修改密码</i></button>
              </div>
            </div>
            <form className="form-horizontal">
              <div className="form-group col-md-6">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-picture-o"></i> 头像</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  {headIcon}
                </div>
              </div>

              <div className="form-group col-md-6">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-user"></i> 账号</label>
                <label
                  className="col-md-9 col-sm-9 col-xs-12"> {this.state.node.username}</label>
              </div>
              <div className="form-group col-md-6">
                <label className="col-md-3 col-sm-3 col-xs-12"> 姓名</label>

                <label className="col-md-9 col-sm-9 col-xs-12">
                  {this.state.node.realName}
                </label>
              </div>
              <div className="form-group col-md-6">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-phone"></i> 手机</label>

                <label className="col-md-9 col-sm-9 col-xs-12">
                  {this.state.node.phone}
                </label>
              </div>


              <div className="form-group col-md-6">
                <label className="col-md-3 col-sm-3 col-xs-12"> 邮箱</label>

                <label className="col-md-9 col-sm-9 col-xs-12">
                  {this.state.node.email}
                </label>
              </div>


              <div className="form-group col-md-6">
                <label className="col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-picture-o"></i> 角色</label>

                <label className="col-md-9 col-sm-9 col-xs-12">
                  {roleNmame}
                </label>
              </div>
              <div className="clearfix"></div>
              {content}
            </form>
          </div>
        </div>
      </div>
    );
  }
});

User.Update = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      selectSubject: [],
      cls: 0,
      grade: 0
    };
  },
  changeSubject(flag, node){
    var list = this.state.selectSubject;
    if (flag) {
      list.push(node);
      this.setState({selectSubject: list});
    } else {
      for (var i in list) {
        if (list[i].id === node.id) {
          list.splice(i, 1);
          break;
        }
      }
      this.setState({selectSubject: list});
    }
  },
  componentDidMount: function () {
    this.up = new Uploader();
    var loader = this.up.getLoader();
    var that = this;
    loader.on('fileSuccess', function (file, message) {
      console.log(file);
      var data = {};
      var m = JSON.parse(message);
      data.url = m.url;
      data.title = file.fileName;
      console.log(data);
      //that.setState({headIcon: data.url});
      $('#headIcon').attr('src', '/learn' + data.url);
      $('#headIcon').removeClass('hidden');
      $("[name='headIcon']").val(data.url);
    });
    loader.on('fileError', function (file, message) {
      that.props.handleAlertShow('无法上传文件: ' + message);
      notification.error({
        message: "上传失败",
        description: '无法上传文件: ' + message
      });
    });

    var uid = this.props.params.id;
    let { query } = this.props.location;
    var role = Number.parseInt(query.role);
    $.get(config.ip + 'learn/user/detail', {id: uid, role: role}, function (data) {
      if (data.code) {
        var node = data.data;
        console.log(node);
        $("[name='username']").val(node.username);
        $("[name='id']").val(node.id);
        $("[name='phone']").val(node.phone);
        $("[name='email']").val(node.email);
        $("[name='realName']").val(node.realName);
        //$("[name='myClasses']").val(node.myClasses);
        $("[name='parentName']").val(node.parentName);
        $("[name='role']").val(role);
        if (role > 1) {
          var s = node.mySubjects || [];
          console.log('mySubjects', s);
          that.setState({selectSubject: s});
        } else {
          var cls = node.myCurrentClass || [];
          try {
            var cid = cls.classData.id;
            $("[name='classId']").val(cid);
            var gid = cls.classData.grade.id;
            that.setState({cls: cid, grade: gid});
          } catch (err) {
            console.log(err);
          }
        }
        if (node.headIcon) {
          $('#headIcon').attr('src', '/learn' + node.headIcon);
          $('#headIcon').removeClass('hidden');
          $("[name='headIcon']").val(node.headIcon);
        }
        //$("[name='mySubjects']").val(node.mySubjects);
        //console.log(node.myCurrentClass);

      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });

    if (role === 1) {
      $('.role_1').removeClass('hidden');
      $('.role_2').addClass('hidden');
    } else if (role === 2) {
      $('.role_1').addClass('hidden');
      $('.role_2').removeClass('hidden');
    } else if (role === 3) {
      $('.role_1').addClass('hidden');
      $('.role_2').addClass('hidden');
    } else if (role === 4) {
      $('.role_1').addClass('hidden');
      $('.role_2').addClass('hidden');
    } else if (role === 5) {
      $('.role_1').addClass('hidden');
      $('.role_2').addClass('hidden');
    }
  },
  chooseClass: function (id) {
    $("[name='classId']").val(id);
  },
  handleUpdate: function (event) {
    /**
     * http post data
     * @type {*[]}
     */
    var that = this;
    $.post('/learn/user/update', $("#userForm").serialize(), function (data) {
      if (data.code) {
        that.history.pushState(null, '/user');
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
    event.stopPropagation();
  },
  cpw: function (event) {
    var uid = ReactDOM.findDOMNode(this.refs.uid).value;
    this.history.pushState(null, '/user/spw/' + uid);
    event.stopPropagation();
  },
  render: function () {
    let { query } = this.props.location;
    var roleName;
    var role = Number.parseInt(query.role);
    if (role === 1) {
      roleName = "学生";
    } else if (role === 2) {
      roleName = "教师";
    } else if (role === 3) {
      roleName = "学科组长";
    } else if (role === 4) {
      roleName = "年级组长";
    } else if (role === 5) {
      roleName = "管理员";
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
                            <a className="ant-breadcrumb-link" href="#/user">用户管理</a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">更新用户</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="large">
            <div className="title"><i className="fa fa-user-md"></i> 用户信息</div>
            <div className="row">
              <div className="col-md-12 ">
                <button onClick={this.cpw} className="btn bg-green pull-right" type="button"><i
                  className="fa fa-pencil-square-o">
                  重置密码</i></button>
              </div>
            </div>
            <form id="userForm" className="form-horizontal">
              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-picture-o"></i> 头像</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <img id="headIcon" src="" className="img-circle profile_img hidden"/>
                  <UploadHead />
                  <input type="hidden" name="headIcon"/>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-credit-card"></i> 账号</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input type="text" name="username" className="form-control"/>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-user"></i> 姓名</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input name="realName" type="text" className="form-control"/>
                </div>
              </div>

              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-phone"></i> 手机</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input type="text" name="phone" className="form-control"/>
                </div>
              </div>


              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-envelope-o"></i> 邮箱</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input type="text" name="email" className="form-control"/>
                </div>
              </div>


              <div className="form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-users"></i> 角色</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <label className="control-label"> {roleName}</label>

                  <input type="hidden" name="role"/>
                  <input ref="uid" type="hidden" name="id"/>
                </div>
              </div>
              <div className="role_1 form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-cogs"></i> 所属班级</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <GradeClass grade={this.state.grade} select={this.state.cls}
                              chooseClass={this.chooseClass}/>
                  <input type="hidden" name="classId" className="form-control"/>
                </div>
              </div>
              <div className="role_2 hidden form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-tags"></i> 任教科目</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <Util.Subject changeSubject={this.changeSubject}
                                select={this.state.selectSubject}
                                list={this.state.subject}/>
                </div>
              </div>

              <div className="role_1 form-group col-md-6">
                <label className="control-label col-md-4 col-sm-4 col-xs-12"><i
                  className="fa fa-user-secret"></i> 家长姓名</label>

                <div className="col-md-8 col-sm-8 col-xs-12">
                  <input type="text" name="parentName" className="form-control"/>
                </div>
              </div>

              <div className="clearfix"></div>
              <div>
                <button onClick={this.handleUpdate} className="btn bg-green pull-right"
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

User.Spw = React.createClass({
  mixins: [History],
  componentDidMount: function () {
    var node = this.props.params;
    $("[name='id']").val(node.id);
  },
  handleCpw: function (event) {
    /**
     * http post data
     * @type {*[]}
     */
    $.post('/learn/user/setPassword', $("#userForm").serialize(), (data)=> {
      if (data.code) {
        this.history.pushState(null, '/user' );
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
                            <a className="ant-breadcrumb-link" href="#/user">用户管理</a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">重置密码</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="middle">
            <div className="title"><i className="fa fa-user-md"></i> 密码</div>
            <form className="form-horizontal col-md-9">
              <input type="hidden" name="id"/>

              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12">新密码</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input name="passwordNew" type="text" className="form-control"/>
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12">确认密码</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input type="text" className="form-control"/>
                </div>
              </div>
              <div>
                <button onClick={this.handleCpw} className="btn bg-green pull-right"
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

User.Cpw = React.createClass({
  mixins: [History],
  componentDidMount: function () {
    var node = this.props.params;
    $("[name='id']").val(node.id);
  },
  handleCpw: function (event) {
    /**
     * http post data
     * @type {*[]}
     */
    $.post('/learn/user/changePassword', $("#userForm").serialize(), (data)=> {
      if (data.code) {
        this.history.pushState(null, '/user' );
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
                            <a className="ant-breadcrumb-link" href="#/user">用户管理</a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">修改密码</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="middle">
            <div className="title"><i className="fa fa-user-md"></i> 密码</div>
            <form className="form-horizontal col-md-9">
              <input type="hidden" name="id"/>

              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12">旧密码</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input type="text" name="password" className="form-control"/>
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12">新密码</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input name="passwordNew" type="text" className="form-control"/>
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12">确认密码</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input type="text" className="form-control"/>
                </div>
              </div>
              <div>
                <button onClick={this.handleCpw} className="btn bg-green pull-right"
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

User.Index = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: [],
      page: 0,
      totalPage: 0
    };
  },
  changePage(list, page, totalPage){
    this.setState({list: list, page: page, totalPage: totalPage});
  },
  componentDidMount: function () {
    var that = this;
    let { query } = this.props.location;
    var role;
    if (query) {
      role = query.role || 1;
    }
    $.get(config.ip + 'learn/user/query/page', {pageNO: 1, role: role, pageSize: 10}, function (data) {
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
  render: function () {
    let { query } = this.props.location;
    var role;
    if (query) {
      role = query.role || 1;
    }
    return (
      <User.List role={role} {...this.state} changePage={this.changePage} title="账号管理"/>
    );
  }
});

module.exports = User;
