/**
 * Created by Administrator on 2015/7/13.
 */
var React = require('react');
var Menu = require('antd/lib/menu');
var imageURL = require('../../images/img.jpg');
var Modal = require('antd/lib/modal');
var confirm = Modal.confirm;
var Router = require('react-router');
var Navi = Router.Navigation;

var App = React.createClass({
  mixins: [Navi],
  handleDetail: function (event) {
    console.log(this.props);
    var uid = this.props.uid;
    var role = this.props.role;
    this.transitionTo('userDetail', {id: uid}, {role: role});
    event.stopPropagation();
  },
  handleClick(e) {
    e.stopPropagation();
    confirm({
      title: '您是否确认退出',
      onOk: function () {
        window.location.href = '/login.html';
      },
      onCancel: function () {
      }
    });
  },
  render() {
    var headIcon = imageURL;
    if (this.props.headIcon) {
      if (this.props.headIcon !== '') {
        headIcon = '/learn' + this.props.headIcon;
      }
    }
    return (<Menu style={{"borderBottom": 0}} onClick={this.handleClick} mode="horizontal">
      <li className="item">
        <a className="user-profile dropdown-toggle">
          <img src={headIcon} alt="" onClick={this.handleDetail}/>
          <i className="fa fa-sign-out text-red"></i>退出
        </a>
      </li>
    </Menu>);
  }
});

var Navigation = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data || []
    };
  },
  render(){
    return (
      <div className="top">
        <div className="nav_menu">
          <div className="" role="navigation">
            <div className="nav toggle">
              <a id="menu_toggle"><i className="fa fa-bars"></i></a>
            </div>
            <div className="nav navbar-nav navbar-right">
              <App uid={this.props.id} role={this.props.userRole} headIcon={this.props.headIcon}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Navigation;
