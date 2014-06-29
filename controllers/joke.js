var config = require('../config');
var async = require('async');
var jokeproxy = require('../proxy/joke');
var authproxy = require('../proxy/auth');
var validator = require('validator');
var util = require('util');
var fs = require('fs');

exports.index = function(req, res, next) {
    var jokeid = req.params.jokeid;
    jokeproxy.getJokeById(jokeid, function(err, joke) {
        if (err) return next(err);
        return res.render('joke/index', {joke: joke});
    });
};

exports.create = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    //前端设置 只有添加图片 或者 填写content之后 才可以点击button提交
    //否则禁用button
    var content = req.body.content;
    var link = req.body.link;
    var photos = req.files;
    var video = req.body.video;
    var question = req.body.question;
    var answer = req.body.answer;
    var select = req.body.select;

    if (content === '' && !photos) {
        return res.render('index', {error: '分享内容不能为空'});
    }
    content = validator.trim(content);
    content = validator.escape(content);
    if (link !== '' && !validator.isURL(link)) {
        return res.render('index', {error: '不正确的链接地址'});
    }
    //上传图片处理
    var uploads = [];
    if (photos.length === 1) {
        if (util.isArray(photos[0])) {
            for(var i = 0; i < photos[0].length; i++) {
                uploads.push(photos[0][i]);
            }
        } else {
            uploads.push(photos[0]);
        }
    }
    async.waterfall([function(callback) {
        authproxy.getUserById(req.session.user._id, function(err, user) {
            if (err) return next(err);
            if (user) {
                callback(null, user);
            }
        });
    }, function(user, callback) {
        if (uploads.length > 0) {
            var photoArray = [];
            var dateStamp = Date.now().toString();
            var phoDir = path.join(config.uploadDir, dateStamp, user.name);
            fs.mkdir(phoDir, function(err) {
                if (err) return next(err);
                uploads.forEach(function(photo) {
                    var filename = Date.now() + '_' + photo.name;
                    var savepath = path.resolve(path.join(phoDir, filename));
                    var photoUrl = config.siteStaticDir
                    + '/uploads/'
                    + dateStamp
                    + '/' + user.name
                    + '/' + filename;
                    photo.url = photoUrl;
                    photo.author = user;
                    photoArray.push(photo);
                    fs.rename(photo.path, savepath, function(err) {
                        if (err) return next(err);
                        callback(null, photoArray);
                    });
                });
            });
        } else {
            callback(null, user);
        }
    }], function(err, result) {
        if (err) return next(err);
        if (result.length > 0) {
            if (util.isArray(result[0])) {
                jokeproxy.createNewJoke(result[0][0].user._id, content, link, result[0], function(err) {
                    if (err) return next(err);
                    return res.redirect('/');
                });
            } else {
               jokeproxy.createNewJoke(result[0]._id, content, link, [], function(err) {
                   if (err) return next(err);
                   return redirect('/');
               });
            }
        }
    });
}