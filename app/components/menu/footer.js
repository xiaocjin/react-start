/**
 * Created by Administrator on 2015/7/10.
 */
var React = require('react');
var Footer = React.createClass({
    off(){
        $.post('/usr/logout', {}, function (data) {
            if (data.code) {
                window.location.href = '/login.html';
            }
        });
    },
    render(){
        return (
            <div className="sidebar-footer hidden-small">

            </div>
        );
    }
});

module.exports = Footer;
