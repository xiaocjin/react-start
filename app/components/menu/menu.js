/**
 * Created by Administrator on 2015/7/9.
 */
var React = require('react');
var imageURL = require('../../images/img.jpg');

var List = require('./list.js');
var Footer = require('./footer.js');
var Menu = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data || []
    };
  },
  render(){
    var headIcon = imageURL;
    if (this.props.headIcon) {
      if (this.props.headIcon !== '') {
        headIcon = '/learn' + this.props.headIcon;
      }
    }
    return (
      <div className="left_col">
        <div>
          <div className="nav_title">
            <a href="/" className="site_title"><i className="fa fa-paw"></i>
              <span>  全息教学</span></a>
          </div>
          <div className="clearfix"></div>
          <div className="profile">
            <div className="profile_pic">
              <img src={headIcon} alt="..." className="img-circle profile_img"/>
            </div>
            <div className="profile_info">
              <span>欢迎,</span>

              <h2>{this.props.title}</h2>
            </div>
            <div className="clearfix"></div>
          </div>
          <List items={this.props.items}/>
          <Footer/>
        </div>
      </div>
    );
  }
});

/** ******  left menu  *********************** **/
$(function () {
  $('#sidebar-menu li ul').slideUp();
  $('#sidebar-menu li').removeClass('active');

  //$('#sidebar-menu li').click(function () {
  //    if ($(this).is('.active')) {
  //        $(this).removeClass('active');
  //        $('ul', this).slideUp();
  //        $(this).removeClass('nv');
  //        $(this).addClass('vn');
  //    } else {
  //        $('#sidebar-menu li ul').slideUp();
  //        $(this).removeClass('vn');
  //        $(this).addClass('nv');
  //        $('ul', this).slideDown();
  //        $('#sidebar-menu li').removeClass('active');
  //        $(this).addClass('active');
  //    }
  //});

  $('#menu_toggle').click(function () {
    if ($('body').hasClass('nav-md')) {
      $('body').removeClass('nav-md');
      $('body').addClass('nav-sm');
      //$('.left_col').removeClass('scroll-view');
      $('.left_col').removeAttr('style');
      $('.sidebar-footer').hide();

      if ($('#sidebar-menu li').hasClass('active')) {
        $('#sidebar-menu li.active').addClass('active-sm');
        $('#sidebar-menu li.active').removeClass('active');
      }
    } else {
      $('body').removeClass('nav-sm');
      $('body').addClass('nav-md');
      $('.sidebar-footer').show();

      if ($('#sidebar-menu li').hasClass('active-sm')) {
        $('#sidebar-menu li.active-sm').addClass('active');
        $('#sidebar-menu li.active-sm').removeClass('active-sm');
      }
    }
  });
});

/* Sidebar Menu active class */
$(function () {
  var url = window.location;
  $('#sidebar-menu a[href="' + url + '"]').parent('li').addClass('current-page');
  $('#sidebar-menu a').filter(function () {
    return this.href === url;
  }).parent('li').addClass('current-page').parent('ul').slideDown().parent().addClass('active');
});


module.exports = Menu;

