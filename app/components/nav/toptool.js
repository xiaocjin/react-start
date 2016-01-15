/**
 * Created by Administrator on 2015/7/13.
 */
var React = require('react');
var imageURL = require('../../images/img.jpg');
var Menu = require('antd/lib/menu');
var Dropdown = require('antd/lib/dropdown');

var menu = <Menu className='nav-right' style={{ 'width': 200 }}>
    <Menu.Item key="0">
        <a href="http://www.alipay.com/">第一个菜单项</a>
    </Menu.Item>
    <Menu.Item key="1">
        <a href="http://www.taobao.com/">第二个菜单项</a>
    </Menu.Item>
    <Menu.Item key="3">第三个菜单项</Menu.Item>
</Menu>;

var Toptool = React.createClass({
    getInitialState: function () {
        return {
            data: this.props.data || []
        };
    },
    off(){
        $.post('/usr/logout', {}, function (data) {
            if (data.code) {
                window.location.href = '/login.html';
            }
        });
    },
    render(){
        return (
            <div className="item">
                <a className="user-profile dropdown-toggle" data-toggle="dropdown"
                   aria-expanded="false">
                    <img src={imageURL} alt=""/>
                    {this.props.title}
                    <Dropdown overlay={menu}>
                        <button className="ant-btn ant-btn-circle ant-btn-menu">
                            <i className="anticon anticon-down"></i>
                        </button>
                    </Dropdown>
                </a>
            </div>
        );
    }
});

module.exports = Toptool;
