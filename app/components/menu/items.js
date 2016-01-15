/**
 * Created by Administrator on 2015/7/13.
 */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Items = React.createClass({
    handleClick(event){
        $('#sidebar-menu li ul').slideUp();
        $('#sidebar-menu li').removeClass('active');
        $('#sidebar-menu li').removeClass('active-sm');
        event.stopPropagation();
        //console.log(event.target);
    },
    render(){
        var that = this;
        var nodes = this.props.nodes.map(function (node, i) {
            return (
                <li key={i}>
                    <Link to={node.link} onClick={that.handleClick} >{node.title}</Link>
                </li>
            );
        });
        return (
            <ul className="nav child_menu" style={{display: "none"}}>
                {nodes}
            </ul>
        );
    }
});

module.exports = Items;
