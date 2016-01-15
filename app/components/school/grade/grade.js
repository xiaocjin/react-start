/**
 * Created by Administrator on 2015/7/23.
 */
var React = require('react');
var Grade = {};
var Util = require('./util');
var GradeModal = require('./gradeModal');
var config = require('../../config');
var notification = require('antd/lib/notification');
Grade.List = React.createClass({
    addCls: function (i, data) {
        /**
         * http post data
         */
        var list = this.state.list;
        var that = this;
        data.gradeId = list[i].gradeID;
        console.log(data);
        $.post('/learn/schoolclasses/add', data, function (res) {
            if (res.code) {
                var cls;
                if (list[i].cls) {
                    cls = list[i].cls;
                    cls.push(data);
                } else {
                    cls = [];
                    cls.push(data);
                    list[i].cls = cls;
                }
                that.setState({smShow: false, list: list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    delCls: function (grade, i, id) {
        var that = this;
        console.log(i, id);
        $.post('/learn/schoolclasses/del', {id: id}, function (res) {
            if (res.code) {
                that.state.list[grade].cls.splice(i, 1);
                that.setState({list: that.state.list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    addGrade: function (data) {
        /**
         * http post data
         */
        if (this.state.list.length === 0) {
            data.orderSeq = 1;
        } else {
            data.orderSeq = this.state.list[this.state.list.length - 1].orderSeq + 1;
        }
        var that = this;
        var list = this.state.list;
        $.post('/learn/grades/add', data, function (res) {
            if (res.code) {
                list.push(data);
                that.setState({smShow: false, list: list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    delGrade: function (i, id) {
        var that = this;
        var list = this.state.list;
        $.post('learn/grades/del', {id: id}, function (res) {
            if (res.code) {
                list.splice(i, 1);
                that.setState({smShow: false, list: list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    openGradeModal: function (event) {
        this.setState({smShow: true});
        event.stopPropagation();
    },
    closeGradeModal: function () {
        this.setState({smShow: false});
    },
    getInitialState: function () {
        return {
            list: [],
            smShow: false
        };
    },
    componentDidMount: function () {
        /**
         * http get data
         * @type {*[]}
         */
        var that = this;
        $.get(config.ip + 'learn/gradeClass/list', function (data) {
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
    upgrade: function (event) {
        event.stopPropagation();
    },
    render: function () {
        var GradeList = Util.GradeList;
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
                            <span className="ant-breadcrumb-link">年级</span>
                            <span className="ant-breadcrumb-slash">/</span>
                        </span>
                    </div>

                    <div className="large">
                        <div className="title"><i className="fa fa-home"></i> 年级信息</div>
                        <div className="row">
                            <button onClick={this.openGradeModal} className="btn bg-green pull-right offset"
                                    type="button"><i className="fa fa-plus">
                                新建年级</i></button>
                            <button onClick={this.upgrade} className="btn bg-green pull-right offset" type="button"><i
                                className="fa fa-angle-double-up">
                                升学/毕业</i></button>
                        </div>

                        <div className="row">
                            <GradeList list={this.state.list} delGrade={this.delGrade}
                                       delCls={this.delCls} addCls={this.addCls}/>
                        </div>
                    </div>
                </div>
                <GradeModal visible={this.state.smShow} onHide={this.closeGradeModal}
                            addGrade={this.addGrade}/>
            </div>
        );
    }
});

module.exports = Grade;
