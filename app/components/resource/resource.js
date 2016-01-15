/**
 * Created by Administrator on 2015/7/23.
 */
var React = require('react');
var Resource = {};
var config = require('../config');
var notification = require('antd/lib/notification');

Resource.CommonSelect = React.createClass({
    handleChange: function (event) {
        this.props.handleChange(event.target.value);
        event.stopPropagation();
    },
    render: function () {
        //var optionState = this.props.select;
        var select = this.props.select;
        if (this.props.disabled) {
            return (
                <select value={select} onChange={this.handleChange} className="form-control" disabled>
                    <option value="0"> -- 请选择 --</option>
                    {this.props.list.map(function (node) {
                        return (
                            <option key={node.id} value={node.id}>{node.title}</option>
                        );
                    }, this) }
                </select>
            );
        } else {
            return (
                <select value={select} onChange={this.handleChange} className="form-control">
                    <option value="0"> -- 请选择 --</option>
                    {this.props.list.map(function (node) {
                        return (
                            <option key={node.id} value={node.id}>{node.title}</option>
                        );
                    }, this) }
                </select>
            );
        }

    }
});

Resource.GradeSelect = React.createClass({
    getInitialState: function () {
        return {
            select: this.props.select,
            list: []
        };
    },
    componentDidMount: function () {
        var that = this;
        $.get(config.ip + 'learn/grade/list', function (data) {
            if (data.code) {
                var list = data.data || [];
                if (list[0]) {
                    //that.props.choose(list[0].id);
                }
                var content = [];
                for (var i in list) {
                    var c = {
                        id: list[i].id,
                        title: list[i].gradeName
                    };
                    content.push(c);
                }
                that.setState({list: content});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    componentDidUpdate: function () {
        if (this.props.select) {
            if (!this.state.select) {
                this.setState({select: this.props.select});
            }
        }
    },
    handleChange: function (value) {
        this.setState({select: value});
        this.props.choose(value);
    },
    render: function () {

        var disabled = false;
        if (this.props.disabled) {
            disabled = true;
        }
        if (this.state.select) {
            return (
                <Resource.CommonSelect select={this.state.select} list={this.state.list}
                                       handleChange={this.handleChange} disabled={disabled}/>
            );
        } else {
            return (
                <Resource.CommonSelect select='0' list={this.state.list} handleChange={this.handleChange}
                                       disabled={disabled}/>
            );
        }
    }
});

Resource.SubjectSelect = React.createClass({
    getInitialState: function () {
        return {
            select: this.props.select,
            list: []
        };
    },
    componentDidUpdate: function () {
        if (this.props.select) {
            if (!this.state.select) {
                console.log('---');
                this.setState({select: this.props.select});
            }
        }
    },
    componentDidMount: function () {
        var that = this;
        $.get(config.ip + 'learn/subjects/list', function (data) {
            if (data.code) {
                var list = data.data || [];
                if (list[0]) {
                    //that.props.choose(list[0].id);
                }
                var content = [];
                for (var i in list) {
                    var c = {
                        id: list[i].id,
                        title: list[i].subjectName
                    };
                    content.push(c);
                }
                that.setState({list: content});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    handleChange: function (value) {
        this.setState({select: value});
        this.props.choose(value);
    },
    render: function () {
        var disabled = false;
        if (this.props.disabled) {
            disabled = true;
        }
        if (this.state.select) {
            return (
                <Resource.CommonSelect select={this.state.select} list={this.state.list}
                                       handleChange={this.handleChange} disabled={disabled}/>
            );
        } else {
            return (
                <Resource.CommonSelect select='0' list={this.state.list} handleChange={this.handleChange}
                                       disabled={disabled}/>
            );
        }
    }
});

Resource.ClassSelect = React.createClass({
    componentDidMount: function () {
        var that = this;
        $.get(config.ip + 'learn/schoolclasses/list', function (data) {
            if (data.code) {
                var list = data.data || [];
                that.setState({list: list});
            } else {
                notification.error({
                    message: "数据获取失败",
                    description: data.msg
                });
            }
        });
    },
    getInitialState: function () {
        return {
            list: []
        };
    },
    handleChange: function (value) {
        this.props.choose(value);
    },
    render: function () {
        return (
            <Resource.CommonSelect list={this.state.list} handleChange={this.handleChange}/>
        );
    }
});

Resource.ChapterSelect = React.createClass({
    getInitialState: function () {
        return {
            second: [],
            last: [],
            selectFirst: this.props.selectFirst,
            selectSecond: this.props.selectSecond,
            selectLast: this.props.selectLast
        };
    },
    changeFirst: function (oid) {
        var id = Number.parseInt(oid);
        this.props.choose(id, 1);
        //this.setState({selectFirst: id, selectSecond: 0, selectLast: 0});
        var data = [];
        var that = this;
        for (var i in this.props.chapter) {
            if (Number.parseInt(this.props.chapter[i].id) === id) {
                data = this.props.chapter[i].children;
                that.setState({second: data, last: []});
                return;
            }
        }

    },
    changeSecond: function (oid) {
        var id = Number.parseInt(oid);
        this.props.choose(id, 2);
        //this.setState({selectSecond: id});
        var data = [];
        for (var i in this.state.second) {
            if (Number.parseInt(this.state.second[i].id) === id) {
                data = this.state.second[i].children;
                this.setState({last: data});
                return;
            }
        }
    },
    changeLast: function (id) {
        this.props.choose(id, 3);
        //this.setState({selectLast: id});
    },
    componentDidUpdate(){
        if (this.props.chapter.length) {
            if (this.state.second.length === 0) {
                if (this.props.selectFirst) {
                    var data = [];
                    var d = [];
                    var first = Number.parseInt(this.props.selectFirst);
                    for (var i in this.props.chapter) {
                        if (Number.parseInt(this.props.chapter[i].id) === first) {
                            data = this.props.chapter[i].children;
                            break;
                        }
                    }
                    if (this.state.last.length === 0) {
                        var second = Number.parseInt(this.props.selectSecond);
                        if (this.props.selectSecond) {
                            for (var j in data) {
                                if (Number.parseInt(data[j].id) === second) {
                                    d = data[j].children;
                                    this.setState({second: data, last: d});
                                    return;
                                }
                            }
                        } else {
                            if (data.length) {
                                this.setState({second: data, last: []});
                            }
                        }
                    } else {
                        if (data.length) {
                            this.setState({second: data, last: []});
                        }
                    }
                }
            }
        }
    },
    render: function () {
        var disabled = this.props.disabled;
        if (!disabled) {
            disabled = false;
        }
        return (
            <div><Resource.ChapterLevel pre={0} list={this.props.chapter}
                                        handleChange={this.changeFirst} select={this.props.selectFirst}
                                        level="1" disabled={disabled}/>
                <Resource.ChapterLevel
                    handleChange={this.changeSecond} list={this.state.second} pre={this.props.selectFirst}
                    select={this.props.selectSecond} level="2" disabled={disabled}/>
                <Resource.ChapterLevel
                    handleChange={this.changeLast} list={this.state.last} select={this.props.selectLast}
                    pre={this.props.selectSecond} level="3" disabled={disabled}/>
            </div>
        );
    }
});

Resource.ChapterLevel = React.createClass({
    getInitialState: function () {
        return {
            list: this.props.list || [],
            pre: this.props.pre
        };
    },
    handleChange: function (event) {
        this.props.handleChange(event.target.value);
        event.stopPropagation();
    },
    componentDidMount: function () {

    },
    componentDidUpdate(){

        if (this.props.list !== this.state.list) {
            this.setState({list: this.props.list});
        }
    },
    render: function () {
        if (this.state.list.length) {
            var select = this.props.select;
            var disabled = this.props.disabled;
            if (disabled) {
                return (
                    <select value={select} onChange={this.handleChange} className="form-control" disabled>
                        <option value="0"> -- 请选择 --</option>
                        {this.state.list.map(function (node) {
                            return (
                                <option key={node.id} value={node.id}>{node.title}</option>
                            );
                        }, this) }
                    </select>
                );
            } else {
                return (
                    <select value={select} onChange={this.handleChange} className="form-control">
                        <option value="0"> -- 请选择 --</option>
                        {this.state.list.map(function (node) {
                            return (
                                <option key={node.id} value={node.id}>{node.title}</option>
                            );
                        }, this) }
                    </select>
                );
            }
        } else {
            return (<div></div>);
        }
    }
});

Resource.ChapterMixin = {
    getInitialState: function () {
        return {
            grade: 0,
            subject: 0,
            chapter: [],
            selectFirst: 0,
            selectSecond: 0,
            selectLast: 0
        };
    },
    selectGrade: function (id) {
        $("[name='gradeID']").val(id);
        this.setState({grade: id});
        var that = this;
        if (this.state.subject) {
            var condition = {
                grade: id,
                subject: this.state.subject
            };
            $.get(config.ip + 'learn/chapters/list', condition, function (data) {
                if (data.code) {
                    var list = data.data || [];
                    console.log(list);
                    that.setState({
                        chapter: list, selectFirst: 0,
                        selectSecond: 0,
                        selectLast: 0
                    });
                } else {
                    notification.error({
                        message: "数据获取失败",
                        description: data.msg
                    });
                }
            });
        }
    },
    selectSubject: function (id) {
        $("[name='subjectID']").val(id);
        this.setState({subject: id});
        var that = this;
        if (this.state.grade) {
            var condition = {
                grade: this.state.grade,
                subject: id
            };
            $.get(config.ip + 'learn/chapters/list', condition, function (data) {
                if (data.code) {
                    var list = data.data || [];
                    console.log(list);
                    that.setState({
                        chapter: list, selectFirst: 0,
                        selectSecond: 0,
                        selectLast: 0
                    });
                } else {
                    notification.error({
                        message: "数据获取失败",
                        description: data.msg
                    });
                }
            });
        }
    },
    selectChapter: function (id, level) {
        console.log('chapterID', id);
        $("[name='chapterID']").val(id);
        level = Number.parseInt(level);
        if (level === 1) {
            this.setState({selectFirst: id, selectSecond: 0, selectLast: 0});
        } else if (level === 2) {
            this.setState({selectSecond: id, selectLast: 0});
        } else if (level === 3) {
            this.setState({selectLast: id});
        }
    }
};

module.exports = Resource;
