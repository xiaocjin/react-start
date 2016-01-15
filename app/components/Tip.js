/**
 * Created by Administrator on 2015/9/8.
 */
var React = require('react');
var Tooltip = require('antd/lib/tooltip');
var Tip = React.createClass({
    render() {
        return (
            <Tooltip title={this.props.content}>{this.props.children}</Tooltip>
        );
    }
});

module.exports = Tip;
