/**
 * Created by Administrator on 2015/7/30.
 */
var React = require('react');
var Modal = require('antd/lib/modal');
var Util = require('./util');
var PageNum = require('../Pagination');
var GradeSelect = require('../resource/resource').GradeSelect;
var SubjectSelect = require('../resource/resource').SubjectSelect;
var notification = require('antd/lib/notification');
var config = require('../config');

var ActivityModal = React.createClass({
    handleConfirm: function () {
        this.props.onTrue(this.state.choice);
        this.setState({list: [], choice: 0});
        this.props.onHide();
    },
    choice: function (id, data) {
        console.log(this.state.choice, data);
        this.setState({choice: data});
    },
    query: function (node) {
        this.props.query(node);
        //event.stopPropagation();
    },
    getInitialState: function () {
        return {
            pageNO: 1,
            totalPage: 0,
            list: [],
            choice: 0
        };
    },
    search: function (event) {
        /**
         * http get data
         */
        this.changePage(1);
        if (event) {
            event.stopPropagation();
        }
    },
    changePage: function (p) {
        var page = p || this.state.pageNO;
        if (page) {
            var condition = {pageNO: page};
            if (this.state.grade) {
                condition.gradeID = this.state.grade;
            }
            if (this.state.subject) {
                condition.subjectID = this.state.subject;
            }
            condition.pageSize = 10;
            var that = this;
            $.get(config.ip + 'learn/exercise/query/page', condition, function (data) {
                if (data.code) {
                    var list = data.data;
                    that.setState({list: list, totalPage: data.total, pageNO: page});
                } else {
                    notification.error({
                        message: "数据获取失败",
                        description: data.msg
                    });
                }
            });
        }
    },
    selectGrade: function (id) {
        this.setState({grade: id});
    },
    selectSubject: function (id) {
        this.setState({subject: id});
    },
    render() {
        var ExerciseList = Util.Exercise;
        var pageNum;
        if (this.state.totalPage) {
            pageNum = <PageNum total={this.state.totalPage} current={this.state.pageNO} changePage={this.changePage}/>;
        }
        return (
            <Modal title="添加练习" width={960}
                   visible={this.props.visible}
                   onOk={this.handleConfirm}
                   onCancel={this.props.onHide}>

                <div className="row exercise">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-addon">年级</span>
                            <GradeSelect choose={this.selectGrade}/>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-addon">学科</span>
                            <SubjectSelect choose={this.selectSubject}/>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <button onClick={this.search} className="btn bg-green pull-left" type="button"><i
                            className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <ExerciseList list={this.state.list} choice={this.choice} query={this.query}/>
                    {pageNum}
                </div>
                <div className="clearfix"></div>
            </Modal>
        );
    }
});

module.exports = ActivityModal;
