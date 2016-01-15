/**
 * Created by Administrator on 2015/7/10.
 */
import React from 'react'
import ReactDOM from 'react-dom';
var Items = require('./items');
var List = React.createClass({
    handleClick(i, event){
        var node = ReactDOM.findDOMNode(this.refs["li_" + i]);
        var li = $(node);
        //console.log(li.is('.active'), li);
        if (li.is('.active')) {
            li.removeClass('active');
            li.find("ul").slideUp();
            li.removeClass('nv');
            li.addClass('vn');
        } else {
            $('#sidebar-menu li ul').slideUp();
            $('#sidebar-menu li').removeClass('active');
            $('#sidebar-menu li').removeClass('active-sm');
            li.addClass('active');
            li.removeClass('vn');
            li.addClass('nv');
            li.find("ul").slideDown(function () {
                //$('#sidebar-menu li.active ul').addClass('display: block;');
                $('#sidebar-menu li.active ul').css("display", "block");
            });
        }
        event.stopPropagation();
    },
    render(){
        return (
            <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                <div className="menu_section">
                    <ul className="nav side-menu">
                        {this.props.items.map(function (item, i) {
                            var name = "";
                            if (item.type === 1) {
                                name = "fa fa-home";
                            } else if (item.type === 2) {
                                name = "fa fa-user-md";
                            } else if (item.type === 3) {
                                name = "fa fa-laptop";
                            } else if (item.type === 4) {
                                name = "fa fa-windows";
                            } else if (item.type === 5) {
                                name = "fa fa-comments";
                                //name = "fa fa-bar-chart-o";
                            } else if (item.type === 6) {
                                name = "fa fa-book";
                            } else if (item.type === 7) {
                                name = "fa fa-spinner";
                            } else {
                                name = "fa fa-windows";
                            }
                            var refName = 'li_' + i;
                            return (
                                <li key={i} ref={refName} onClick={this.handleClick.bind(this, i)}><a><i
                                    className={name}></i> {item.title} <span
                                    className="fa fa-chevron-down"></span></a>
                                    <Items nodes={item.nodes}/>
                                </li>
                            );
                        }, this) }
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = List;
