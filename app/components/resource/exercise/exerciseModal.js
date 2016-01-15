/**
 * Created by Administrator on 2015/7/30.
 */
var React = require('react');
var PageNum = require('../../Pagination');
var Modal = require('antd/lib/modal');
var config = require('../../config');
var GradeSelect = require('../resource').GradeSelect;
var SubjectSelect = require('../resource').SubjectSelect;
var notification = require('antd/lib/notification');
var ExerciseModal = React.createClass({
    handleConfirm: function () {
        this.props.onTrue(this.state.choice);
        this.setState({list: [], choice: []});
        this.props.onHide();
    },
    choice: function (data) {
        console.log(this.state.choice, data);
        //data.questionID = data.id;
        this.setState({choice: data});
    },
    score: function (node, value, index) {
        var list = this.state.list;
        list[index].score = value;
        this.setState({list: list});
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
            choice: []
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
            $.get(config.ip + 'learn/question/query/page', condition, function (data) {
                if (data.code) {
                    var da = data.data || [];
                    that.setState({list: da, totalPage: data.total, pageNO: page});
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
        var ExerciseItemList = require('./util').ExerciseItemList;
        var pageNum;
        if (this.state.totalPage) {
            pageNum = <PageNum total={this.state.totalPage} current={this.state.pageNO} changePage={this.changePage}/>;
        }
        return (
            <Modal title="添加题目" width={960}
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
                    <ExerciseItemList select={this.props.select} list={this.state.list} choice={this.choice}
                                      query={this.query} score={this.score}/>
                    {pageNum}
                </div>
                <div className="clearfix"></div>
            </Modal>
        );
    }
});

module.exports = ExerciseModal;
