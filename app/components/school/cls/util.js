/**
 * Created by Administrator on 2015/7/28.
 */
var React = require('react');
var Util = {};
var Tip = require('../../Tip');
require('../../../../bower_components/devbridge-autocomplete/dist/jquery.autocomplete.js');
var config = require('../../config');
var notification = require('antd/lib/notification');
var Modal = require('antd/lib/modal');
var confirm = Modal.confirm;

Util.ClsInfo = React.createClass({
    render: function () {
        var ClsMaster = Util.ClsMaster;
        var ClsTeachers = Util.ClsTeachers;
        var Students = Util.Students;
        return (
            <div className="col-md-12 col-sm-12 col-xs-12">
                <ClsMaster master={this.props.master} delMaster={this.props.delMaster}
                           addMaster={this.props.addMaster}/>
                <ClsTeachers list={this.props.teachers}
                             delTeacher={this.props.delTeacher} addTeacher={this.props.addTeacher}/>
                <Students list={this.props.students} delStudent={this.props.delStudent}
                          addStudent={this.props.addStudent}/>
            </div>
        );
    }
});
Util.ClsMaster = React.createClass({
    user: {},
    addUser: function () {
        if (this.user.data) {
            this.props.addMaster(this.user.data);
        }
        $('#master').val('');
    },
    handleClick: function (data, event) {
        var that = this;
        confirm({
            title: '您是否确认要删除这项内容',
            onOk: function () {
                that.props.delMaster();
            },
            onCancel: function () {
            }
        });
        event.stopPropagation();
    },
    componentDidMount: function () {

    },
    loadMaster: function () {

    },
    render: function () {
        var content;
        if (this.props.master.realName) {
            content = <div className="col-md-8 col-md-offset-2">
                <table className="table table-striped responsive-utilities jambo_table bulk_action">
                    <thead>
                    <tr className="headings">
                        <th className="column-title" style={{display: 'table-cell'}}>姓名</th>
                        <th className="column-title" style={{display: 'table-cell'}}>任教科目</th>
                        <th className="column-title" style={{display: 'table-cell'}}>操作</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr className="even pointer">
                        <td className=" ">{this.props.master.realName}</td>
                        <td className=" ">{this.props.master.subject}</td>
                        <td className=" ">
                            <Tip content='删除'>
                                <button onClick={this.handleClick.bind(this, 0)} type="button" className="btn btn-link">
                                    <i className="fa fa-trash-o"></i>
                                </button>
                            </Tip>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>;
        } else {
            content =
                <div className="input-group col-md-3 col-md-offset-7">
                    <span className="input-group-addon">姓名</span>
                    <input onClick={this.loadMaster} type="text" id="master" className="autocp form-control"/>
            <span onClick={this.addUser} className="input-group-addon"><i className="fa fa-plus green">
            </i></span>
                </div>;

        }
        return (
            <div className="large">
                <div className="title">班主任</div>
                <div className="row">
                    {content}
                </div>
            </div>);
    }
});
Util.ClsTeachers = React.createClass({
    user: {},
    addUser: function () {
        console.log(this.user.data);
        if (this.user.data) {
            this.props.addTeacher(this.user.data);
        }
        $('#teacher').val('');
    },
    handleClick: function (i, id, event) {
        var that = this;
        confirm({
            title: '您是否确认要删除这项内容',
            onOk: function () {
                that.props.delTeacher(i, id);
            },
            onCancel: function () {
            }
        });
        event.stopPropagation();
    },
    componentDidMount: function () {
        var that = this;
        $.get(config.ip + 'learn/user/teachers/query/list', function (data) {
            if (data.code) {
                var node = data.data || [];
                console.log(node);
                var arr = [];
                for (var i in node) {
                    arr.push({
                        value: node[i].realName, data: node[i]
                    });
                }
                $('#teacher').autocomplete({
                    lookup: arr,
                    onSelect: function (suggestion) {
                        that.user = suggestion;
                    }
                });
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
            <div className="large">
                <div className="title">任课老师</div>
                <div className="row">
                    <table className="table table-striped responsive-utilities jambo_table bulk_action">
                        <thead>
                        <tr className="headings">
                            <th className="column-title" style={{display: 'table-cell'}}>姓名</th>
                            <th className="column-title" style={{display: 'table-cell'}}>任教科目</th>
                            <th className="column-title" style={{display: 'table-cell'}}>操作</th>
                        </tr>
                        </thead>

                        <tbody>
                        {this.props.list.map(function (node, i) {
                            return (
                                <tr key={i} className="even pointer">
                                    <td className=" ">{node.realName}</td>
                                    <td className=" ">{node.subject}</td>
                                    <td className=" ">
                                        <div className="btn-group" role="group">
                                            <Tip content='删除'>
                                                <button onClick={this.handleClick.bind(this, i, node.id)} type="button"
                                                        className="btn btn-link">
                                                    <i className="fa fa-trash-o"></i>
                                                </button>
                                            </Tip>
                                        </div>
                                    </td>
                                </tr>);
                        }, this) }
                        </tbody>

                    </table>
                </div>
                <div className="row">
                    <div className="input-group col-md-3 col-md-offset-7">
                        <span className="input-group-addon">姓名</span>
                        <input type="text" id="teacher" className="autocp form-control"/>
                    <span onClick={this.addUser} className="input-group-addon"><i className="fa fa-plus green">
                    </i></span>
                    </div>
                </div>
            </div>
        );
    }
});
Util.Students = React.createClass({
    user: {},
    addUser: function () {
        if (this.user.data) {
            this.props.addStudent(this.user.data);
        }
        $('#student').val('');
    },
    handleClick: function (i, id, event) {
        var that = this;
        confirm({
            title: '您是否确认要删除这项内容',
            onOk: function () {
                that.props.delStudent(i, id);
            },
            onCancel: function () {
            }
        });
        event.stopPropagation();
    },
    detail: function () {
        //this.transitionTo('userIndex');
    },
    loadStudents: function () {
        var that = this;
        $.get(config.ip + 'learn/schoolclasses/noClassStudents', function (data) {
            if (data.code) {
                var node = data.data || [];
                console.log(node);
                var arr = [];
                for (var i in node) {
                    arr.push({
                        value: node[i].realName, data: node[i]
                    });
                }
                $('#student').autocomplete({
                    lookup: arr,
                    onSelect: function (suggestion) {
                        that.user = suggestion;
                    }
                });
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    componentDidMount: function () {

    },
    render: function () {
        return (
            <div className="large">
                <div className="title">学生</div>
                <div className="row">
                    <div className="cls">
                        {this.props.list.map(function (node, i) {
                            return (
                                <div key={i} className="col-md-2 x_point"><a onClick={this.detail }
                                                                             className="btn btn-link ">{node.realName}</a><a
                                    className="text-danger x_location"><i
                                    onClick={this.handleClick.bind(this, i, node.id)}
                                    className="fa fa-times">
                                </i></a></div>);
                        }, this) }
                    </div>
                </div>
                <div className="row">
                    <div className="input-group col-md-3 col-md-offset-7">
                        <span className="input-group-addon">姓名</span>
                        <input onClick={this.loadStudents} type="text" id="student" className="autocp form-control"/>
                    <span onClick={this.addUser} className="input-group-addon"><i className="fa fa-plus green">
                    </i></span>
                    </div>
                </div>
            </div>
        );
    }
});

Util.GradeClass = React.createClass({
    componentDidMount: function () {
        var that = this;
        var grade = Number.parseInt(that.props.grade);
        var select = Number.parseInt(that.props.select);
        $.get(config.ip + 'learn/gradeClass/list', function (data) {
            if (data.code) {
                var list = data.data;
                console.log(list);
                console.log(grade, select);
                if (select) {
                    var cls = [];
                    for (var i in list) {
                        if (Number.parseInt(list[i].gradeID) === grade) {
                            cls = list[i].cls || [];
                            break;
                        }
                    }
                    console.log(cls, grade, select);
                    that.setState({list: list, cls: cls, grade: grade, select: select});
                } else {
                    that.setState({list: list});
                }
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    getInitialState: function () {
        return {
            cls: [],
            list: [],
            grade: 0,
            select: 0
        };
    },
    handleChange: function (event) {
        var id = Number.parseInt(event.target.value);
        for (var i in this.state.list) {
            if (Number.parseInt(this.state.list[i].gradeID) === id) {
                var cls = this.state.list[i].cls || [];
                this.setState({cls: cls, grade: id});
                event.stopPropagation();
                return;
            }
        }
        event.stopPropagation();
    },
    chooseClass(id){
        this.setState({select: id});
        this.props.chooseClass(id);
    },
    componentDidUpdate(){
        if (this.state.select === 0) {
            if (this.props.select) {
                console.log('-----');
                var that = this;
                var grade = Number.parseInt(this.props.grade);
                var select = Number.parseInt(this.props.select);
                $.get(config.ip + 'learn/gradeClass/list', function (data) {
                    if (data.code) {
                        var list = data.data;
                        console.log(list);
                        console.log(grade, select);
                        var cls = [];
                        for (var i in list) {
                            if (Number.parseInt(list[i].gradeID) === grade) {
                                cls = list[i].cls || [];
                                break;
                            }
                        }
                        console.log(cls, grade, select);
                        that.setState({list: list, cls: cls, grade: grade, select: select});

                    } else {
                        notification.error({
                            message: "数据获取失败",
                            description: data.msg
                        });
                    }
                });
            }
        }
    },
    render: function () {
        if (this.props.disabled) {
            return (
                <div style={{display: 'inline-block'}}>
                    <select value={this.state.grade} onChange={this.handleChange} className="form-control md" disabled>
                        <option value="0"> -- 请选择 --</option>
                        {this.state.list.map(function (node) {
                            return (
                                <option key={'gd' + node.gradeID} value={node.gradeID}>{node.gradeName}</option>
                            );
                        }, this) }
                    </select>
                    <Util.NextClass select={this.state.select} list={this.state.cls} chooseClass={this.chooseClass}
                                    disabled/>
                </div>
            );
        } else {
            return (
                <div style={{display: 'inline-block'}}>
                    <select value={this.state.grade} onChange={this.handleChange} className="form-control md">
                        <option value="0"> -- 请选择 --</option>
                        {this.state.list.map(function (node) {
                            return (
                                <option key={'gd' + node.gradeID} value={node.gradeID}>{node.gradeName}</option>
                            );
                        }, this) }
                    </select>
                    <Util.NextClass select={this.state.select} list={this.state.cls} chooseClass={this.chooseClass}/>
                </div>
            );
        }
    }
});

Util.NextClass = React.createClass({

    componentDidMount: function () {

    },
    handleChange: function (event) {
        var id = Number.parseInt(event.target.value);
        this.props.chooseClass(id);
        event.stopPropagation();
    },
    render: function () {
        if (this.props.list.length) {
            if (this.props.disabled) {
                return (
                    <select value={this.props.select} onChange={this.handleChange} className="form-control md" disabled>
                        <option value="0"> -- 请选择 --</option>
                        {this.props.list.map(function (node) {
                            return (
                                <option key={'cl' + node.id} value={node.id}>{node.clsName}</option>
                            );
                        }, this) }
                    </select>
                );
            } else {
                return (
                    <select value={this.props.select} onChange={this.handleChange} className="form-control md">
                        <option value="0"> -- 请选择 --</option>
                        {this.props.list.map(function (node) {
                            return (
                                <option key={'cl' + node.id} value={node.id}>{node.clsName}</option>
                            );
                        }, this) }
                    </select>
                );
            }
        } else {
            return (<div></div>);
        }
    }
});

module.exports = Util;
