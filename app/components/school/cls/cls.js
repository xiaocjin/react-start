/**
 * Created by Administrator on 2015/7/23.
 */
var React = require('react');
var Cls = {};
var Util = require('./util');
require('./cls.css');
var config = require('../../config');
var notification = require('antd/lib/notification');

Cls.List = React.createClass({
    getInitialState: function () {
        return {
            master: {},
            teachers: [],
            students: [],
            classId: ""
        };
    },
    delMaster: function () {
        this.setState({master: {}});
    },
    delTeacher: function (i, id) {
        var list = this.state.teachers;
        var that = this;
        $.post('learn/schoolclasses/deleteTeacher', {classId: this.state.classId, targetId: id}, function (data) {
            if (data.code) {
                list.splice(i, 1);
                that.setState({teachers: list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });

    },
    delStudent: function (i, id) {
        var list = this.state.students;
        var that = this;
        $.post('learn/schoolclasses/deleteStudent', {classId: this.state.classId, targetId: id}, function (data) {
            if (data.code) {
                list.splice(i, 1);
                that.setState({teachers: list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    addMaster: function (user) {
        this.setState({master: user});
    },
    addTeacher: function (user) {
        console.log(user);
        var list = this.state.teachers;
        for (var i in list) {
            if (list[i].id === user.id) {
                return;
            }
        }
        var that = this;
        $.post('learn/schoolclasses/addTeacher', {classId: this.state.classId, targetId: user.id}, function (data) {
            if (data.code) {
                list.push(user);
                that.setState({teachers: list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    addStudent: function (user) {
        console.log(user);
        var list = this.state.students;
        for (var i in list) {
            if (list[i].id === user.id) {
                return;
            }
        }
        var that = this;
        $.post('learn/schoolclasses/addStudent', {classId: this.state.classId, targetId: user.id}, function (data) {
            if (data.code) {
                list.push(user);
                that.setState({students: list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    chooseClass: function (id) {
        console.log(id);
        this.setState({
            classId: id
        });
    },
    search: function (event) {
        var id = this.state.classId;
        if (id !== '') {
            var that = this;
            $.get(config.ip + 'learn/schoolclasses/info', {id: id}, function (data) {
                if (data.code) {
                    var node = data.data;
                    console.log(node);
                    var ms;
                    if (node.masters.length) {
                        ms = node.master[0];
                    } else {
                        ms = {};
                    }
                    that.setState({master: ms, teachers: node.teachers, students: node.students});
                } else {
                    notification.error({
                        message: "数据获取失败",
                        description: data.msg
                    });
                }
            });
        }
        event.stopPropagation();
    },
    render: function () {
        var ClsInfo = Util.ClsInfo;
        var content;
        if (this.state.students.length) {
            content = <ClsInfo {...this.state} confirm={this.props.confirm} delMaster={this.delMaster}
                                               delTeacher={this.delTeacher} delStudent={this.delStudent}
                                               addMaster={this.addMaster} addTeacher={this.addTeacher}
                                               addStudent={this.addStudent}/>;
        } else {
            content = <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="x_panel" style={{'minHeight': 400 + 'px'}}></div>
            </div>;
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
                            <a className="ant-breadcrumb-link" href="#/school/info">学校管理</a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">班级</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                    </div>

                    <div className="large">
                        <div className="title"><i className="fa fa-home"></i> 班级信息</div>
                        <div className="row">
                            <div className="col-md-6 col-md-offset-2">
                                <label>班级&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                <Util.GradeClass chooseClass={this.chooseClass}/>
                            </div>

                            <div className="col-md-3 pull-right">

                                <button onClick={this.search} className="btn bg-green pull-left" type="button">
                                    <i
                                        className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Cls;
