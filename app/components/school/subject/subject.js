/**
 * Created by Administrator on 2015/7/23.
 */
var React = require('react');
var Subject = {};
import { History } from 'react-router';
var Util = require('./util');
var config = require('../../config');
var notification = require('antd/lib/notification');
var Resumable = require('../../../../bower_components/resumablejs/resumable');
Subject.List = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {
      list: []
    };
  },
  componentDidMount: function () {
    /**
     * http get data
     * @type {*[]}
     */
    var that = this;
    $.get(config.ip + 'learn/subjects/list', function (data) {
      if (data.code) {
        var list = data.data;
        that.setState({list: list});
        console.log(list);
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });
  },
  addNew: function (event) {
    this.history.pushState(null, '/school/subject/add');
    event.stopPropagation();
  },
  del: function (i, id) {
    var that = this;
    $.post('/learn/subjects/del', {id: id}, function (data) {
      if (data.code) {
        var list = that.state.list;
        list.splice(i, 1);
        that.setState({list: list});
      } else {
        notification.error({
          message: "数据获取失败",
          description: data.msg
        });
      }
    });

  },
  render: function () {
    var SubjectList = Util.SubjectList;
    return (
      <div className="row">
        <div className="show">
          <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <a className="ant-breadcrumb-link" href="#/school/info">学校管理</a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">学科管理</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="middle">
            <div className="title"><i className="fa fa-home"></i> 学科</div>
            <div>
              <SubjectList list={this.state.list} del={this.del}/>
            </div>
            <div>
              <button onClick={this.addNew} className="btn bg-green ant-table-pagination" type="button"><i
                className="fa fa-plus">
                新增学科</i></button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

Subject.Add = React.createClass({
  mixins: [History],
  imageUpload: function (iosImage, key, cb) {
    var that = this;
    return function () {
      if (iosImage.files.length > 0) {
        that.r = new Resumable({
          target: '/learn/upload',
          chunkSize: 1 * 1024 * 1024,
          simultaneousUploads: 4,
          testChunks: false,
          throttleProgressCallbacks: 1,
          query: {key: key}
        });
        that.r.addFile(iosImage.files[0]);
        that.r.on('fileSuccess', function (file, message) {
          console.log(file);
          var m = JSON.parse(message);
          cb(m.url);
          that.r = null;
        });
        that.r.on('fileAdded', function (file) {
          that.r.upload();
          console.log('fileAdded', file);
        });
        //alert((iosImage.files[0] instanceof File));
      }
    };
  },
  componentDidMount: function () {
    var iosImage = document.querySelector('#iosImage');
    var androidImage = document.querySelector('#androidImage');
    iosImage.onchange = this.imageUpload(iosImage, 'iOSImage', function (url) {
      console.log(url);
      $("[name='iOSImage']").val(url);
      $('#img1').attr('src', '/learn' + url);
      $('#img1').removeClass('hidden');
    });
    androidImage.onchange = this.imageUpload(androidImage, 'androidImage', function (url) {
      console.log(url);
      $("[name='androidImage']").val(url);
      $('#img2').attr('src', '/learn' + url);
      $('#img2').removeClass('hidden');
    });
  },
  handleAdd: function (event) {
    /**
     * http post data
     * @type {*[]}
     */
    var that = this;
    $.post('/learn/subjects/add', $("#subjectForm").serialize(), function (data) {
      if (data.code) {
        this.history.pushState(null, '/school/subject');
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
                            <a className="ant-breadcrumb-link" href="#/school/subject">学科</a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">添加学科</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="middle">
            <div className="title"><i className="fa fa-home"></i> 添加学科</div>
            <form id="subjectForm" className="ant-form-horizontal">

              <div className="ant-form-item">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square-o"></i> 学科名称</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input type="text" name="subjectName" className="form-control"/>
                </div>
              </div>

              <div className="ant-form-item">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-file-text-o"></i> 学科简介</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <textarea name="introduction" className="form-control" rows="5"></textarea>
                </div>
              </div>
              <div className="ant-form-item">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-picture-o"></i> IOS图标</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input className="ant-form-text" type="file" id="iosImage"/>
                  <input type="hidden" name="iOSImage"/>
                  <img id="img1" src="" className="img-circle profile_img hidden"/>
                </div>
              </div>
              <div className="ant-form-item">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-picture-o"></i> Android图标</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input className="ant-form-text" type="file" id="androidImage"/>
                  <input type="hidden" name="androidImage"/>
                  <img id="img2" src="" className="img-circle profile_img hidden"/>
                </div>
              </div>
              <div>
                <button onClick={this.handleAdd} className="btn bg-green pull-right" type="button">
                  <i className="fa fa-upload">
                    确定</i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

Subject.Update = React.createClass({
  mixins: [History],
  getInitialState: function () {
    return {};
  },
  imageUpload: function (iosImage, key, cb) {
    var that = this;
    return function () {
      if (iosImage.files.length > 0) {
        that.r = new Resumable({
          target: '/learn/upload',
          chunkSize: 1 * 1024 * 1024,
          simultaneousUploads: 4,
          testChunks: false,
          throttleProgressCallbacks: 1,
          query: {key: key}
        });
        that.r.addFile(iosImage.files[0]);
        that.r.on('fileSuccess', function (file, message) {
          console.log(file);
          var m = JSON.parse(message);
          cb(m.url);
          that.r = null;
        });
        that.r.on('fileAdded', function (file) {
          that.r.upload();
          console.log('fileAdded', file);
        });
        //alert((iosImage.files[0] instanceof File));
      }
    };
  },
  componentDidMount: function () {
    let { query } = this.props.location;
    $("[name='subjectName']").val(query.subjectName);
    $("[name='id']").val(query.id);
    $("[name='introduction']").val(query.introduction);
    $("[name='version']").val(query.version);
    if (query.iOSImage) {
      $('#img1').attr('src', '/learn' + query.iOSImage);
      $('#img1').removeClass('hidden');
      $("[name='iOSImage']").val(query.iOSImage);
    }
    if (query.androidImage) {
      $('#img2').attr('src', '/learn' + query.androidImage);
      $('#img2').removeClass('hidden');
      $("[name='androidImage']").val(query.androidImage);
    }
    var iosImage = document.querySelector('#iosImage');
    var androidImage = document.querySelector('#androidImage');
    iosImage.onchange = this.imageUpload(iosImage, 'iOSImage', function (url) {
      console.log(url);
      $("[name='iOSImage']").val(url);
      $('#img1').attr('src', '/learn' + url);
      $('#img1').removeClass('hidden');
    });
    androidImage.onchange = this.imageUpload(androidImage, 'androidImage', function (url) {
      console.log(url);
      $("[name='androidImage']").val(url);
      $('#img2').attr('src', '/learn' + url);
      $('#img2').removeClass('hidden');
    });
  },
  handleUpdate: function (event) {
    /**
     * http post data
     * @type {*[]}
     */
    var that = this;
    $.post('/learn/subjects/update', $("#subjectForm").serialize(), function (data) {
      if (data.code) {
        this.history.pushState(null, '/school/subject');
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
                            <a className="ant-breadcrumb-link" href="#/school/subject">学科</a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">更新学科</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
          </div>

          <div className="middle">
            <div className="title"><i className="fa fa-home"></i> 更新学科</div>
            <form id="subjectForm" className="ant-form-horizontal col-md-9">
              <input type="hidden" name="version"/>

              <div className="ant-form-item">
                <input type="hidden" name="id"/>
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-pencil-square-o"></i> 学科名称</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input type="text" name="subjectName" className="form-control"
                    />
                </div>

              </div>

              <div className="ant-form-item">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-file-text-o"></i> 学科简介</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                                        <textarea name="introduction" className="form-control" rows="5"
                                          />
                </div>
              </div>
              <div className="ant-form-item">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-picture-o"></i> IOS图标</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input type="file" className="ant-form-text" id="iosImage"/>
                  <input type="hidden" name="iOSImage"/>
                  <img id="img1" src="" className="img-circle profile_img hidden"/>
                </div>
              </div>
              <div className="ant-form-item">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                  className="fa fa-picture-o"></i> Android图标</label>

                <div className="col-md-9 col-sm-9 col-xs-12">
                  <input className="ant-form-text" type="file" id="androidImage"/>
                  <input type="hidden" name="androidImage"/>
                  <img id="img2" src="" className="img-circle profile_img hidden"/>
                </div>
              </div>
              <div>
                <button onClick={this.handleUpdate} className="btn bg-green pull-right"
                        type="button"><i
                  className="fa fa-upload">
                  确定</i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = Subject;
