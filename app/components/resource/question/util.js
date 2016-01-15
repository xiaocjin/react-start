/**
 * Created by Administrator on 2015/7/28.
 */
var React = require('react');
var Util = {};
import { History } from 'react-router';
var Tip = require('../../Tip');
var Table = require('antd/lib/table');
Util.QuestionList = React.createClass({
    mixins: [History],
    del: function (node, event) {
        this.props.del(node);
        event.stopPropagation();
    },
    query: function (node, event) {
        this.props.query(node);
        event.stopPropagation();
    },
    update: function (node, event) {
        this.props.update(node);
        event.stopPropagation();
    },
    renderAction: function (text, record) {
        if (this.props.update) {
            return (
                <div className="btn-group">
                    <Tip content='详细'>
                        <button onClick={this.query.bind(this, record)} type="button"
                                className="btn btn-link"><i className="fa fa-search"></i></button>
                    </Tip>
                    <Tip content='编辑'>
                        <button onClick={this.update.bind(this, record)} type="button"
                                className="btn btn-link"><i
                            className="fa fa-pencil-square-o"></i>
                        </button>
                    </Tip>
                    <Tip content='删除'>
                        <button onClick={this.del.bind(this, record)} type="button"
                                className="btn btn-link">
                            <i className="fa fa-trash-o"></i>
                        </button>
                    </Tip>
                </div>
            );
        } else {
            return (
                <div className="btn-group">
                    <Tip content='详细'>
                        <button onClick={this.query.bind(this, record)} type="button"
                                className="btn btn-link"><i className="fa fa-search"></i></button>
                    </Tip>
                </div>
            );
        }
    }, expandedRowRender: function (record) {
        return (<div dangerouslySetInnerHTML={{__html: record.title}}/>);
    },
    render: function () {
        var columns = [
            {
                title: '题干', dataIndex: 'title',
                render: function (text) {
                    return <div style={{textOverflow: 'ellipsis', height: '20px'}}
                                dangerouslySetInnerHTML={{__html: text}}/>;
                }
            },
            {
                title: '难度', dataIndex: 'degree',
                render: function (text) {
                    if (Number.parseInt(text) === 1) {
                        return (<div>简单</div>);
                    } else if (Number.parseInt(text) === 2) {
                        return (<div>一般</div>);
                    } else if (Number.parseInt(text) === 3) {
                        return (<div>困难</div>);
                    }
                    return (<div>未知</div>);
                }
            },
            {title: '分值', dataIndex: 'score'},
            {
                title: '题型', dataIndex: 'type',
                render: function (text) {
                    if (Number.parseInt(text) === 1) {
                        return (<div>单选</div>);
                    } else if (Number.parseInt(text) === 2) {
                        return (<div>多选</div>);
                    } else if (Number.parseInt(text) === 0) {
                        return (<div>判断</div>);
                    }
                    return (<div>未知</div>);
                }
            },
            {
                title: '添加时间', dataIndex: 'addDate',
                render: function (text) {
                    var time = window.moment(text).format("YYYY-MM-DD");
                    return (<div>{time}</div>);
                }
            },
            {
                title: '修改时间', dataIndex: 'updateDate',
                render: function (text) {
                    var time = window.moment(text).format("YYYY-MM-DD");
                    return (<div>{time}</div>);
                }
            },
            {title: '操作', dataIndex: '', render: this.renderAction}
        ];
        return (
            <Table columns={columns}
                   dataSource={this.props.list}
                   expandedRowRender={this.expandedRowRender}
                   className="table" pagination={false}/>
        );
    }
});

Util.Single = React.createClass({
    componentDidMount: function () {

    },
    addOption: function (event) {
        this.props.addOption();
        event.stopPropagation();
        event.preventDefault();
    },
    delOption: function (event) {
        this.props.delOption();
        event.stopPropagation();
        event.preventDefault();
    },
    handleChange: function (event) {
        this.props.handleChange(event.target.value, event.target.checked);
    },
    render: function () {
        var list = this.props.items || [];
        var content;
        if (this.props.update) {
            content = <div className="ant-form-item col-md-12">
                <div className="ant-btn-group pull-right">
                    <button className="ant-btn ant-btn-primary" onClick={this.addOption}>
                        <span className="fa fa-plus"></span>
                    </button>
                    <button className="ant-btn ant-btn-primary" onClick={this.delOption}>
                        <span className="fa fa-minus"></span>
                    </button>
                </div>
            </div>;
        }
        return (
            <div>
                <input type="hidden" name="type" value="1"/>
                {list.map(function (node, i) {
                    return (
                        <div key={node.id} className="ant-form-item col-md-12">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                                className="fa fa-caret-square-o-right"></i>
                                选项 {String.fromCharCode(64 + parseInt(node.id))}
                            </label>

                            <div className="input-group">
                                <input name="options" type="text" className="form-control" defaultValue={node.content}/>
                                <span className="input-group-addon"><input name="corrects" type="radio"
                                                                           onChange={this.handleChange}
                                                                           checked={node.checked}
                                                                           value={node.id}/>正确答案</span>
                            </div>
                        </div>
                    );
                }, this) }
                {content}
            </div>
        );
    }
});

Util.Multi = React.createClass({
    getInitialState: function () {
        return {
            items: [1, 2, 3, 4]
        };
    },
    addOption: function (event) {
        this.props.addOption();
        event.stopPropagation();
        event.preventDefault();
    },
    delOption: function (event) {
        this.props.delOption();
        event.stopPropagation();
        event.preventDefault();
    },
    handleChange: function (event) {
        this.props.handleChange(event.target.value, event.target.checked);
    },
    render: function () {
        var list = this.props.items || [];
        var content;
        if (this.props.update) {
            content = <div className="form-group col-md-12">
                <div className="ant-btn-group pull-right">
                    <button className="ant-btn ant-btn-primary" onClick={this.addOption}>
                        <span className="fa fa-plus"></span>
                    </button>
                    <button className="ant-btn ant-btn-primary" onClick={this.delOption}>
                        <span className="fa fa-minus"></span>
                    </button>
                </div>
            </div>;
        }
        return (
            <div>
                <input type="hidden" name="type" value="2"/>
                {list.map(function (node, i) {
                    return (
                        <div key={node.id} className="ant-form-item col-md-12">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                                className="fa fa-caret-square-o-right"></i>
                                选项{String.fromCharCode(64 + parseInt(node.id))}
                            </label>

                            <div className="input-group">
                                <input key={node.id} name="options" type="text" className="form-control"
                                       defaultValue={node.content}/>
                                <span className="input-group-addon"><input name="corrects" type="checkbox"
                                                                           onChange={this.handleChange}
                                                                           checked={node.checked}
                                                                           value={node.id}/>正确答案</span>
                            </div>
                        </div>
                    );
                }, this) }
                {content}
            </div>
        );
    }
});

Util.Judge = React.createClass({
    handleChange: function (flag, event) {
        if (this.props.handleChange) {
            this.props.handleChange(flag, true);
        }
        event.stopPropagation();
    },
    render: function () {
        var content;
        if (this.props.items.length) {
            content = <div className="input-group control-label-text">
                <div className="col-md-6">
                    <input type="radio" name="isCorrect" className="flat"
                           value="1" onChange={this.handleChange.bind(this, 1)}
                           checked={this.props.items[0].checked}/><label>正确</label>
                </div>
                <div className="col-md-6">
                    <input type="radio" name="isCorrect" className="flat"
                           value="0" onChange={this.handleChange.bind(this, 0)}
                           checked={this.props.items[1].checked}/><label>错误</label>
                </div>
            </div>;
        }
        return (
            <div className="ant-form-item col-md-12">
                <input type="hidden" name="type" value="0"/>
                <label className="control-label col-md-3 col-sm-3 col-xs-12"><i
                    className="fa fa-caret-square-o-right"></i> 答案</label>

                {content}
            </div>
        );
    }
});

module.exports = Util;
