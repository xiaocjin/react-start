/**
 * Created by Administrator on 2015/7/23.
 */
var React = require('react');
var School = {};
var Uploader = require('../upload/headUpload.js');
var UploadBody = require('../upload/head');
var config = require('../config');
var notification = require('antd/lib/notification');

School.Info = React.createClass({
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
            $('#logo').attr('src', data.url);
            $('#logo').removeClass('hidden');
            $("[name='logo']").val(data.url);
        });
        loader.on('fileError', function (file, message) {
            notification.error({
                message: "无法上传文件",
                description: message
            });
        });
        $.get(config.ip + 'learn/schoolInfos', function (data) {
            if (data.code) {
                var node = data.data;
                console.log(node);
                if (node) {
                    $("[name='schoolName']").val(node.schoolName);
                    $("[name='introduction']").val(node.introduction);
                    $("[name='id']").val(node.id);
                    $("[name='version']").val(node.version);
                    if (node.logo) {
                        $("[name='logo']").val(node.logo);
                        $('#logo').removeClass('hidden');
                    }
                }
            } else {
                //that.props.handleAlertShow(data.msg);
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    upload(){
        this.up.upload();
    },
    pause(){
        this.up.pause();
    },
    cancel(){
        this.up.cancel();
    },
    componentWillUnmount: function () {
        this.up = null;
    },
    handleClick: function () {
        $.post('/learn/schoolInfos', $("#schoolForm").serialize(), function (data) {
            if (data.code) {
                console.log(data.data);
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
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
                            <span className="ant-breadcrumb-link">学校管理</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">基本信息</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                    </div>

                    <div className="middle">
                        <div className="title"><i className="fa fa-home"></i> 学校信息</div>
                        <form id="schoolForm" className="form-horizontal">
                            <fieldset>
                                <input name="id" type="hidden"/>
                                <input name="version" type="hidden"/>

                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                                        className="fa fa-pencil-square"></i> 学校名称</label>

                                    <div className="col-md-9 col-sm-9 col-xs-12">
                                        <input name="schoolName" type="text" className="form-control"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                                        className="fa fa-comments"></i> 学校简介</label>

                                    <div className="col-md-9 col-sm-9 col-xs-12">
                                        <textarea name="introduction" className="form-control" rows="5"></textarea>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                                        className="fa fa-file-image-o"></i> 学校LOGO</label>

                                    <div className="col-md-3 col-sm-3 col-xs-12">
                                        <img id="logo" src="" className="img-circle profile_img hidden"/>
                                        <UploadBody />
                                        <input type="hidden" name="logo"/>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={this.handleClick} className="btn bg-green pull-right"
                                            type="button"><i
                                        className="fa fa-upload">
                                        提交</i></button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = School;
