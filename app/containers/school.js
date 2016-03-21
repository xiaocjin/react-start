/**
 * Created by Administrator on 2015/7/23.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import {receiveSchoolInfo,fetchSchoolInfo} from '../actions/school.js';

const School = React.createClass({
    componentDidMount: function () {
        const { fetchSchoolInfo } = this.props;
        fetchSchoolInfo();
    },

    componentWillUnmount: function () {

    },
    handleClick: function () {
        //const { postSchoolInfo } = this.props;
        //postSchoolInfo($("#schoolForm").serialize());
    },
    render: function () {
        const { school } = this.props;
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
                                <input name="id" type="hidden" value={school.id}/>

                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                                        className="fa fa-pencil-square"></i> 学校名称</label>

                                    <div className="col-md-9 col-sm-9 col-xs-12">
                                        <input name="schoolName" type="text" className="form-control"
                                               value={school.schoolName}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                                        className="fa fa-comments"></i> 学校简介</label>

                                    <div className="col-md-9 col-sm-9 col-xs-12">
                    <textarea name="introduction" className="form-control" rows="5"
                              value={school.introduction}></textarea>
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

School.propTypes = {
    school: PropTypes.object.isRequired,
    fetchSchoolInfo: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        school: state.school
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchSchoolInfo: () => {
            dispatch(receiveSchoolInfo({id: 1, schoolName: 'ces', introduction: 'introduction'}, {}));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(School)

