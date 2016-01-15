var React = require('react');
var imageURL = require('../../images/img.jpg');
var Menu = require('antd/lib/menu');
var Items = React.createClass({
    getInitialState: function () {
        return {
            data: this.props.data || []
        };
    },
    render(){
        var items = this.props.data.map(function (item, i) {
            return (
                <li key={i}>
                    <a>
                       <span className="image">
                          <img src={imageURL} alt="Profile Image"/>
                       </span>
                       <span>
                          <span>{item.name}</span>
                          <span className="time">{item.time}3 mins ago</span>
                       </span>
                       <span className="message">
                           {item.content}
                       </span>
                    </a>
                </li>
            );
        });
        return (
            <Menu className="msg_list nav-right">
                {items}
            </Menu>
        );
    }
});

module.exports = Items;
