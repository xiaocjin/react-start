/**
 * Created by Administrator on 2015/7/30.
 */
var React = require('react');
var Modal = require('antd/lib/modal');
var ActivityPublishModal = React.createClass({
    handleConfirm: function () {
        var value = [];
        $("[name='c1']:checked").each(function () {
            value.push($(this).val());
        });
        if(value.length){
            this.props.onTrue(value);
        }
        this.props.onHide();
    },
    getInitialState: function () {
        return {
            listShow: [],
            listSelect: []
        };
    },
    componentDidMount: function () {
    },
    render() {
        var cls = this.props.cls;
        var schoolClassesNotSelect = cls.schoolClassesNotSelect || [];
        //var schoolClassesNotSelect = [{id: 1, clsName: "1班"}, {id: 2, clsName: "2班"}, {id: 3, clsName: "3班"}];
        var schoolClassesAdded = cls.schoolClassesAdded || [];
        var content1, content2;
        if (schoolClassesNotSelect.length) {
            content1 = schoolClassesNotSelect.map(function (node) {
                return (
                    <div key={node.classID} className="col-md-4 col-sm-4 col-xs-12">
                        <input type="checkbox" name="c1"
                               value={node.classID}/><label>{node.className}</label>
                    </div>);
            }, this);
        }
        if (schoolClassesAdded.length) {
            content2 = schoolClassesAdded.map(function (node) {
                return (
                    <div key={node.classID} className="col-md-4 col-sm-4 col-xs-12">
                        <input type="checkbox" name="c2" disabled checked/><label>{node.className}</label>
                    </div>
                );
            }, this);
        }
        return (
            <Modal title="请选择班级"
                   visible={this.props.visible}
                   onOk={this.handleConfirm}
                   onCancel={this.props.onHide}>
                <div className="x_panel">
                    <div className="x_content">
                        <div id="content2" className="panel panel-default">
                            <div className="panel-heading">已发送班级</div>
                            <div className="panel-body">
                                {content2}
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">待选班级</div>
                            <div className="panel-body">
                                {content1}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
});

module.exports = ActivityPublishModal;
