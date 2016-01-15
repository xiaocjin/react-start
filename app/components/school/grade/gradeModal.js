/**
 * Created by Administrator on 2015/7/29.
 */
import React from 'react';
import ReactDOM from 'react-dom';
var Modal = require('antd/lib/modal');

var GradeModal = React.createClass({
    handleOk() {
        var data = {};
        data.gradeName = ReactDOM.findDOMNode(this.refs.gradeName).value;
        data.introduction = ReactDOM.findDOMNode(this.refs.introduction).value;
        this.props.addGrade(data);
    },
    handleCancel() {
        this.props.onHide();
    },
    render() {
        return <div>
            <Modal title="新增年级"
                   visible={this.props.visible}
                   onOk={this.handleOk}
                   onCancel={this.handleCancel}>
                <form className="ant-form-horizontal">
                    <div className="ant-form-item">
                        <label className="col-6">年级名称：</label>

                        <div className="col-14">
                            <input ref="gradeName" name="gradeName" className="ant-input" type="text" placeholder="一年级"/>
                        </div>
                    </div>
                    <div className="ant-form-item">
                        <label className="col-6">年级介绍：</label>
                        <div className="col-14">
                            <input ref="introduction" name="introduction"className="ant-input" type="text" placeholder="1234"/>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>;
    }
});

module.exports = GradeModal;
