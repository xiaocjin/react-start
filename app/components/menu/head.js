/**
 * Created by Administrator on 2015/7/10.
 */
var React = require('react');
var imageURL = require('../../images/img.jpg');
var Head = React.createClass({
    render(){
        return (
            <div>
                <div className="navbar nav_title" style={{border: 0}}>
                    <a href="/" className="site_title"><i className="fa fa-paw"></i>
                        <span>Gentellela Alela!</span></a>
                </div>
                <div className="clearfix"></div>
                <div className="profile">
                    <div className="profile_pic">
                        <img src={imageURL} alt="..." className="profile_img"/>
                    </div>
                    <div className="profile_info">
                        <span>Welcome,</span>
                        <h2>{this.props.title}</h2>
                    </div>
                </div>
            </div>);
    }
});

module.exports = Head;
