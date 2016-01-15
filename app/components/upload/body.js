/**
 * Created by Administrator on 2015/8/12.
 */
var React = require('react');
var pauseImage = require('../../images/pause.png');
var cancelImage = require('../../images/cancel.png');
var resumeImage = require('../../images/resume.png');
var Body = React.createClass({
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
                    将电脑里的文件拖拽到此上传 或者 <a className="resumable-browse"><u>选择文件</u></a>
                </div>

                <div className="resumable-progress">
                    <table>
                        <tr>
                            <td width="100%">
                                <div className="progress-container">
                                    <div className="progress-bar"></div>
                                </div>
                            </td>
                            <td className="progress-text" nowrap="nowrap"></td>
                            <td className="progress-pause" nowrap="nowrap">
                                <a onClick={this.props.upload}
                                   className="progress-resume-link"><img
                                    src={resumeImage}
                                    title="Resume upload"/></a>
                                <a onClick={this.props.pause}
                                   className="progress-pause-link"><img src={pauseImage}
                                                                        title="Pause upload"/></a>
                                <a onClick={this.props.cancel}
                                   className="progress-cancel-link"><img
                                    src={cancelImage}
                                    title="Cancel upload"/></a>
                            </td>
                        </tr>
                    </table>
                </div>

                <ul className="resumable-list"></ul>

            </div>
        );
    }
});

module.exports = Body;
