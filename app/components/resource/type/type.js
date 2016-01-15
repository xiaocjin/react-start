/**
 * Created by Administrator on 2015/7/23.
 */
var React = require('react');
var Type = {};
var Util = require('./util');
var TypeModal = Util.TypeModal;
var TypeModalTwo = Util.TypeModalTwo;
var GradeSelect = require('../resource').GradeSelect;
var SubjectSelect = require('../resource').SubjectSelect;
require('./view.css');
var config = require('../../config');
var notification = require('antd/lib/notification');

Type.List = React.createClass({
    getInitialState: function () {
        return {
            list: [],
            smShow: false,
            bgShow: false,
            content: {}
        };
    },
    componentDidMount: function () {

    },

    search: function (event) {
        var that = this;
        var condition = {};
        if (this.state.grade) {
            condition.grade = this.state.grade;
        }
        if (this.state.subject) {
            condition.subject = this.state.subject;
        }
        $.get(config.ip + 'learn/chapters/list', condition, function (data) {
            if (data.code) {
                var list = data.data;
                console.log(list);
                that.setState({list: list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
        if (event) {
            event.stopPropagation();
        }
    },

    del: function (i, id) {
        var that = this;
        //var list = this.state.list;
        //data.chapterLevel = 1;
        console.log(id);
        that.props.confirm(function () {
            $.post('/learn/chapters/del', {id: id}, function (data) {
                if (data.code) {
                    that.search();
                } else {
                    notification.error({
                        message: "数据获取失败",
                        description: data.msg
                    });
                }
            });
        });
        //event.stopPropagation();
    },
    refresh: function () {
        this.search();
    },
    addType: function (data) {
        /**
         * http post data
         */
        var that = this;
        data.chapterLevel = 1;
        console.log(data);
        $.post('/learn/chapters/add', data, function (res) {
            if (res.code) {
                that.setState({grade: data.grade, subject: data.subject});
                that.search();
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: res.msg
                });
            }
        });

    },
    addSubType: function (data) {
        if (this.state.cfn) {
            this.state.cfn(data);
        }
    },
    showModal: function (event) {
        this.setState({smShow: true});
        event.stopPropagation();
    },
    showSubModal: function (cfn, content) {
        var c = content || {};
        this.setState({bgShow: true, cfn: cfn, content: c});
    },
    selectGrade: function (id) {
        this.setState({grade: id});
    },
    selectSubject: function (id) {
        this.setState({subject: id});
    },
    render: function () {
        var InnerList = Util.TypeListTwo;
        let smClose = () => this.setState({smShow: false});
        let bgClose = () => this.setState({bgShow: false});
        return (
            <div className="row">
                <div className="show">
                    <div className="ant-breadcrumb">
                        <span>
                            <a className="ant-breadcrumb-link" href="#/"><i className="anticon anticon-home"></i></a>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                        <span>
                            <span className="ant-breadcrumb-link">章节管理</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                    </div>

                    <div className="large">
                        <div className="title"><i className="fa fa-laptop"></i> 章节</div>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="input-group">
                                    <span className="input-group-addon">年级</span>
                                    <GradeSelect choose={this.selectGrade}/>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="input-group">
                                    <span className="input-group-addon">学科</span>
                                    <SubjectSelect choose={this.selectSubject}/>
                                </div>
                            </div>
                            <div className="col-md-3 pull-right">
                                <button onClick={this.showModal}
                                        className="btn bg-green pull-right"
                                        type="button">
                                    <i className="fa fa-plus">
                                        新建章节</i></button>
                                <button onClick={this.search} className="btn bg-green pull-left" type="button"><i
                                    className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="ui list">
                                {this.state.list.map(function (node, i) {
                                    return (
                                        <div key={node.id} className="item">
                                            <InnerList i={i} list={node.children || [] }
                                                       confirm={this.props.confirm}
                                                       node={node} refresh={this.refresh}
                                                       showSubModal={this.showSubModal} del={this.del}/>
                                        </div>
                                    );
                                }, this) }
                            </div>
                        </div>
                    </div>
                </div>
                <TypeModalTwo visible={this.state.bgShow} onHide={bgClose} addType={this.addSubType}
                              content={this.state.content}/>
                <TypeModal visible={this.state.smShow} onHide={smClose} addType={this.addType}/>
            </div>
        );
    }
});

module.exports = Type;
