/**
 * Created by Administrator on 2015/8/3.
 */
var React = require('react');
var Pagination = require('antd/lib/pagination');
var PageNum = React.createClass({
    handleSelect(page) {
        console.log(page);
        if (this.props.changePage) {
            this.props.changePage(page);
        }
    },
    render() {
        console.log("total", this.props.total);
        return (
            <Pagination simple className="ant-table-pagination" onChange={this.handleSelect}
                        total={Number.parseInt(this.props.total)} current={Number.parseInt(this.props.current)}/>
        );
    }
});


module.exports = PageNum;
