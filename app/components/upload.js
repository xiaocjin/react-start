/**
 * Created by Administrator on 2015/8/11.
 */
var Resumable = require('../../bower_components/resumablejs/resumable');
require('../styles/upload.css');

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
            this.r.assignDrop($('.resumable-drop')[0]);
            this.r.assignBrowse($('.resumable-browse')[0]);

            // Handle file add event
            var that = this;
            this.r.on('fileAdded', function (file) {
                console.log(file);
                // Show progress pabr
                $('.resumable-progress, .resumable-list').show();
                // Show pause, hide resume
                $('.resumable-progress .progress-resume-link').hide();
                $('.resumable-progress .progress-pause-link').show();
                // Add the file to the list
                //$('.resumable-list').append('<li class="resumable-file-' + file.uniqueIdentifier + '">上传 <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>');
                //$('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-name').html(file.fileName);
                // Actually start the upload
                that.r.upload();
            });
            this.r.on('pause', function () {
                // Show resume, hide pause
                $('.resumable-progress .progress-resume-link').show();
                $('.resumable-progress .progress-pause-link').hide();
            });
            this.r.on('complete', function () {
                // Hide pause/resume when the upload has completed
                $('.resumable-progress .progress-resume-link, .resumable-progress .progress-pause-link').hide();
            });
            //this.r.on('fileSuccess', function (file, message) {
            //    // Reflect that the file upload has completed
            //    console.log(file);
            //    var data = {};
            //    var m = JSON.parse(message);
            //    data.url = m.url;
            //    //data.format = m.format;
            //    data.title = file.fileName;
            //    console.log(data);
            //    that.f.push(data);
            //    //$('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(完成)');
            //});
            this.r.on('fileError', function (file, message) {
                // Reflect that the file upload has resulted in error
                $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(无法上传文件: ' + message + ')');
            });
            this.r.on('fileProgress', function (file) {
                // Handle progress for both the file and the overall upload
                $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html(Math.floor(file.progress() * 100) + '%');
                $('.progress-bar').css({width: Math.floor(that.r.progress() * 100) + '%'});
            });
            this.r.on('cancel', function () {
                that.f = [];
                $('.resumable-file-progress').html('取消');
            });
            this.r.on('uploadStart', function () {
                // Show pause, hide resume
                $('.resumable-progress .progress-resume-link').hide();
                $('.resumable-progress .progress-pause-link').show();
            });
        }
    }

    cancel() {
        $('.resumable-list').html('');
        $('.resumable-progress').hide();
        this.r.cancel();
        console.log(this.f);
        return (false);
    }

    upload() {
        this.r.upload();
        return (false);
    }

    pause() {
        this.r.pause();
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
