/**
 * Created by Administrator on 2015/8/26.
 */

var Resumable = require('../../../bower_components/resumablejs/resumable');
require('../../styles/upload.css');

class Uploader {
    constructor() {
        this.r = new Resumable({
            target: '/learn/upload',
            chunkSize: 1 * 1024 * 1024,
            simultaneousUploads: 4,
            testChunks: false,
            throttleProgressCallbacks: 1
        });
        this.f = [];
        if (!this.r.support) {
            $('.resumable-error').show();
        } else {
            // Show a place for dropping/selecting files
            $('.resumable-drop').show();
            this.r.assignBrowse($('.resumable-browse')[0]);

            var that = this;
            this.r.on('fileAdded', function () {
                that.r.upload();
            });
            //this.r.on('fileError', function (file, message) {
            //    // Reflect that the file upload has resulted in error
            //    $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(无法上传文件: ' + message + ')');
            //});
        }
    }

    upload() {
        this.r.upload();
        return (false);
    }

    getFiles() {
        return this.f;
    }

    getLoader() {
        return this.r;
    }
}


module.exports = Uploader;
