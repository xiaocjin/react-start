var React = require('react');
var Items = require('./items');
var Dropdown = require('antd/lib/dropdown');
var Badge = require('antd/lib/badge');

var Message = React.createClass({
    getInitialState: function () {
        return {
            data: this.props.data || []
        };
    },
    render(){
        var items = <Items data={this.props.data}/>;
        return (
            <div className="item">
                <Dropdown overlay={items} trigger="click">
                    <Badge count={this.props.data.length}>
                        <a>
                            <i className="fa fa-envelope-o"></i>
                        </a>
                    </Badge>
                </Dropdown>
            </div>
        );
    }
});

module.exports = Message;
