/**
 * Created by Administrator on 2015/7/28.
 */
var React = require('react');
var Util = {};
var icon = require('../../images/img.jpg');
Util.NoticeList = React.createClass({
  render: function () {
    return (
      <div className="ui feed">
        {this.props.list.map(function (node, i) {
          var time = window.moment(node.addDate).format("YYYY-MM-DD");
          var user = node.creatorName || '管理员';
          var img = icon;
          if (node.creatorIcon) {
            if (node.creatorIcon !== '') {
              img = '/learn' + node.creatorIcon;
            }
          }
          return (
            <div key={i} className="event">
              <div className="label">
                <img src={img}/>
              </div>

              <div className="content">
                <div className="summary"><a className="user"> {user} </a> 发布了一条消息
                  <div className="date">{time}</div>
                </div>
                <div className="meta">
                  <a className="like">&lt;&lt;{node.title}&gt;&gt;</a>
                </div>
                <div className="extra text">
                  {node.detail}
                </div>
              </div>
            </div>);
        }, this) }
      </div>
    );
  }
});

module.exports = Util;
