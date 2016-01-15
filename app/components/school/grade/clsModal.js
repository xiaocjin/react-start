/**
 * Created by Administrator on 2015/7/29.
 */
import React from 'react';
import ReactDOM from 'react-dom';
var Modal = require('antd/lib/modal');
var ClsModal = React.createClass({
    handleOk() {
        var data = {};
        data.clsName = ReactDOM.findDOMNode(this.refs.clsName).value;
        data.startDate = ReactDOM.findDOMNode(this.refs.startDate).value;
        this.props.addCls(data);
        this.props.onHide();
    },
    handleCancel() {
        this.props.onHide();
    },
    render() {
        return <div>
            <Modal title="新增班级"
                   visible={this.props.visible}
                   onOk={this.handleOk}
                   onCancel={this.handleCancel}>
                <form className="ant-form-horizontal">
                    <div className="ant-form-item">
                        <label className="col-6">班级名称：</label>

                        <div className="col-14">
                            <input className="ant-input" ref="clsName" name="clsName" type="text" placeholder="1班"/>
                        </div>
                    </div>
                    <div className="ant-form-item">
                        <label className="col-6">入学年份：</label>

                        <div className="col-14">
                            <input className="ant-input" ref="startDate" name="startDate" type="text" placeholder="2015"/>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>;
    }
});

module.exports = ClsModal;
