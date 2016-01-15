/**
 * Created by Administrator on 2015/7/28.
 */
import React from 'react';
import ReactDOM from 'react-dom';
var Util = {};
var Tip = require('../../Tip');
var GradeSelect = require('../resource').GradeSelect;
var SubjectSelect = require('../resource').SubjectSelect;
var notification = require('antd/lib/notification');
var Modal = require('antd/lib/modal');

Util.TypeListTwo = React.createClass({
    handleClick: function (id, event) {
        var i = this.props.i;
        this.props.del(i, id);
        event.stopPropagation();
    },
    showSubModal: function (flag, node) {
        if (flag) {
            this.props.showSubModal(this.addType);
        } else {
            this.props.showSubModal(this.updateType, node);
        }
    },
    addType: function (data) {
        var that = this;
        //var list = this.state.list;
        data.chapterLevel = 2;
        data.parentId = this.props.node.id;
        console.log(data);
        $.post('/learn/chapters/add', data, function (res) {
            if (res.code) {
                that.props.refresh();
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: res.msg
                });
            }
        });
    },
    updateType: function (data) {
        var that = this;
        console.log(data);
        $.post('/learn/chapters/update', data, function (res) {
            if (res.code) {
                that.props.refresh();
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: res.msg
                });
            }
        });
    },
    render: function () {
        var TypeListThree = Util.TypeListThree;
        return (
            <div className="content">
                <div className="header"><i className="fa fa-circle icon"></i> {this.props.node.title}
                    <div className="btn-group" role="group">
                        <Tip content='新建子章节'>
                            <button onClick={this.showSubModal.bind(this, 1)}
                                    className="btn btn-link"><i
                                className="fa fa-plus icon green"></i></button>
                        </Tip>
                        <Tip content='编辑'>
                            <button onClick={this.showSubModal.bind(this, 0, this.props.node)} className="btn btn-link">
                                <i
                                    className="fa fa-file-text-o icon green"></i>
                            </button>
                        </Tip>
                        <Tip content='删除'>
                            <button onClick={this.handleClick.bind(this, this.props.node.id)}
                                    className="btn btn-link"><i
                                className="fa fa-times icon green"></i></button>
                        </Tip>
                    </div>
                </div>
                <span className="description">{this.props.node.grade.gradeName}</span>
                <span className="description">{this.props.node.subject.subjectName}</span>


                <div className="list">
                    {this.props.list.map(function (node, i) {
                        return (
                            <div key={node.id} className="item">

                                <TypeListThree i={i} list={node.children || [] } confirm={this.props.confirm}
                                               node={node} refresh={this.props.refresh}
                                               showSubModal={this.props.showSubModal} del={this.props.del}/>
                            </div>
                        );
                    }, this) }
                </div>
            </div>
        );
    }
});

Util.TypeListThree = React.createClass({

    del: function (i, node) {
        this.props.del(i, node.id);
        event.stopPropagation();
    },
    handleClick: function (id, event) {
        var i = this.props.i;
        this.props.del(i, id);
        event.stopPropagation();
    },
    updateType: function (data) {
        var that = this;
        console.log(data);
        $.post('/learn/chapters/update', data, function (res) {
            if (res.code) {
                that.props.refresh();
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: res.msg
                });
            }
        });
    },
    addLastType: function (data) {
        var that = this;
        //var list = this.state.list;
        data.chapterLevel = 3;
        data.parentId = this.props.node.id;
        console.log(data);
        $.post('/learn/chapters/add', data, function (res) {
            if (res.code) {
                that.props.refresh();
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: res.msg
                });
            }
        });

    },
    showSubModal: function (flag, node) {
        if (flag) {
            this.props.showSubModal(this.addLastType);
        } else {
            this.props.showSubModal(this.updateType, node);
        }
    },
    render: function () {
        return (
            <div className="content">
                <div className="header"><i className="fa fa-circle-o icon"></i> {this.props.node.title}
                    <div className="btn-group" role="group">
                        <Tip content='新建子章节'>
                            <button onClick={this.showSubModal.bind(this, 1)}
                                    className="btn btn-link"><i
                                className="fa fa-plus icon green"></i></button>
                        </Tip>
                        <Tip content='编辑'>
                            <button onClick={this.showSubModal.bind(this, 0, this.props.node)} className="btn btn-link">
                                <i
                                    className="fa fa-file-text-o icon green"></i>
                            </button>
                        </Tip>
                        <Tip content='删除'>
                            <button onClick={this.handleClick.bind(this, this.props.node.id)}
                                    className="btn btn-link"><i
                                className="fa fa-times icon green"></i></button>
                        </Tip>
                    </div>
                </div>
                <div className="list">
                    {this.props.list.map(function (node, i) {
                        return (
                            <div key={node.id} className="item">

                                <div className="content">
                                    <div className="header"><i className="fa fa-compass icon"></i> {node.title}
                                        <div className="btn-group" role="group">
                                            <Tip content='编辑'>
                                                <button onClick={this.showSubModal.bind(this, 0, node)}
                                                        className="btn btn-link"><i
                                                    className="fa fa-file-text-o icon green"></i>
                                                </button>
                                            </Tip>
                                            <Tip content='删除'>
                                                <button onClick={this.del.bind(this, i, node)} type="button"
                                                        className="btn btn-link icon green">
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </Tip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }, this) }
                </div>
            </div>
        );
    }
});

Util.TypeModal = React.createClass({
    handleConfirm: function () {
        var data = {};
        data.title = ReactDOM.findDOMNode(this.refs.title).value.trim();
        data.gradeId = this.state.grade;
        data.subjectId = this.state.subject;
        this.props.addType(data);
        this.props.onHide();
    },
    selectGrade: function (id) {
        this.setState({grade: id});
    },
    selectSubject: function (id) {
        this.setState({subject: id});
    },
    render() {
        return (
            <Modal title="新建章节"
                   visible={this.props.visible}
                   onOk={this.handleConfirm}
                   onCancel={this.props.onHide}>
                <form className="ant-form-horizontal">
                    <div className="ant-form-item ant-form-item-compact">
                        <label className="col-6">章节名称：</label>

                        <div className="col-14">
                            <input className="ant-input" ref="title" name="title" type="text" />
                        </div>
                    </div>

                    <div className="ant-form-item">
                        <label className="col-6">年级：</label>
                        <div className="col-14">
                            <GradeSelect choose={this.selectGrade}/>
                        </div>
                    </div>

                    <div className="ant-form-item">
                        <label className="col-6">学科：</label>
                        <div className="col-14">
                            <SubjectSelect choose={this.selectSubject}/>
                        </div>
                    </div>
                </form>
            </Modal>
        );
    }
});

Util.TypeModalTwo = React.createClass({
    handleConfirm: function () {
        var data = {};
        data.title = ReactDOM.findDOMNode(this.refs.title).value;
        if (this.props.content.id) {
            data.chapterId = this.props.content.id;
        }
        this.props.addType(data);
        this.props.onHide();
    },
    render() {
        var content, menu;
        if (this.props.content.title) {
            content = <input type="text" ref="title" name="title" className="ant-input"
                             defaultValue={this.props.content.title}/>;
            menu = '编辑章节';
        } else {
            content = <input type="text" ref="title" name="title" className="ant-input"/>;
            menu = '新建章节';
        }
        return (
            <Modal title={menu}
                   visible={this.props.visible}
                   onOk={this.handleConfirm}
                   onCancel={this.props.onHide}>
                <form className="ant-form-horizontal">
                    <div className="ant-form-item ant-form-item-compact">
                        <label className="col-6">章节名称：</label>

                        <div className="col-14">
                            {content}
                        </div>
                    </div>
                </form>
            </Modal>
        );
    }
});

module.exports = Util;
