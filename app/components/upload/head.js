/**
 * Created by Administrator on 2015/8/26.
 */

var React = require('react');
var Head = React.createClass({
    render: function () {
        return (
            <div>
                <div className="resumable-error">
                    Your browser, unfortunately, is not supported by Resumable.js. The
                    library requires support for <a
                    href="http://www.w3.org/TR/FileAPI/">the HTML5 File API</a> along
                    with <a
                    href="http://www.w3.org/TR/FileAPI/#normalization-of-params">file
                    slicing</a>.
                </div>
                <div className="resumable-drop"
                     ondragenter="jQuery(this).addClass('resumable-dragover');"
                     ondragend="jQuery(this).removeClass('resumable-dragover');"
                     ondrop="jQuery(this).removeClass('resumable-dragover');">
                    <a className="resumable-browse"><u>本地文件</u></a>
                </div>
            </div>
        );
    }
});

module.exports = Head;
