/**
 * Created by Administrator on 2015/8/4.
 */
var React = require('react');
var Tip = require('../../Tip');
var Table = require('antd/lib/table');
var Questions = React.createClass({
    data: [],
    componentDidMount: function () {
        this.data = [];
    },
    handleChange: function (node, event) {
        if (event.target.checked) {
            this.data.push(node);
        } else {
            for (var i in this.data) {
                if (this.data[i].id === event.target.value) {
                    this.data.splice(i, 1);
                    break;
                }
            }
        }
        this.props.choice(this.data);
    },
    query: function (node, event) {
        this.props.query(node);
        event.stopPropagation();
    },
    renderAction: function (text, record) {
        return (
            <div className="btn-group">
                <Tip content='详细'>
                    <button onClick={this.query.bind(this, record)} type="button"
                            className="btn btn-link"><i className="fa fa-search"></i></button>
                </Tip>
            </div>
        );
    }, expandedRowRender: function (record) {
        return (<div dangerouslySetInnerHTML={{__html: record.title}}/>);
    },
    render: function () {
        var rowSelection = {
            onSelect: function (record, selected, selectedRows) {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: function (selected, selectedRows) {
                console.log(selected, selectedRows);
            }
        };
        var columns = [
            {
                title: '题干', dataIndex: 'title',
                render: function (text) {
                    console.log(text);
                    return <div style={{textOverflow: 'ellipsis'}} dangerouslySetInnerHTML={{__html: text}}/>;
                }
            },
            {
                title: '难度', dataIndex: 'degree',
                render: function (text) {
                    console.log(text);
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
            {
                title: '分值', dataIndex: 'score',
                render: function (text, record, index) {
                    return (
                        <input type="text" defaultValue={text} onChange={this.handleChange.bind(this, record, index)}/>);
                }
            },
            {
                title: '题型', dataIndex: 'type',
                render: function (text) {
                    console.log(text);
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
                   rowSelection={rowSelection}
                   expandedRowRender={this.expandedRowRender}
                   className="table" pagination={false}/>
        );
    }
});

module.exports = Questions;
