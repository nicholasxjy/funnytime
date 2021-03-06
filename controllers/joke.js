var validator = require('validator');
var util = require('util');
var fs = require('fs');
var path = require('path');
var ndir = require('ndir');
var _ = require('underscore');
var async = require('async');
var config = require('../config');
var jokeproxy = require('../proxy/joke');
var authproxy = require('../proxy/auth');
var likeproxy = require('../proxy/likerelation');
var followproxy = require('../proxy/follow');
var notificationproxy = require('../proxy/notification');
var collectproxy = require('../proxy/collection');

exports.index = function(req, res, next) {
    var jokeid = req.params.jokeid;
    var query = {_id: jokeid};
    var notificationid = req.query.notificationid;
    jokeproxy.getJokesByQuery(query, {}, function(err, joke) {
        if (err) return next(err);
        async.parallel([function(cb) {
            likeproxy.getLikeRelationByQuery({userid: req.session.user._id, jokeid: jokeid}, function(err, docs) {
                if (err) return next(err);
                if (!docs || docs.length === 0) {
                    return cb(null, joke[0]);
                }
                for(var i = 0, len = docs.length;i < len; i++) {
                    if (docs[i].type === 'like') joke[0].isLike = true;
                    if (docs[i].type === 'dislike') joke[0].isDislike = true;
                }
                return cb(null, joke[0]);
            });
        }, function(cb) {
            if (joke[0].authorid.toString() === req.session.user._id.toString()) {
                return cb(null, joke[0]);
            } else {
                var query = {userid: joke[0].authorid, followid: req.session.user._id};
                followproxy.getFollowByQuery(query, function(err, docs) {
                    if (err) return next(err);
                    joke[0].author.hasFollowed = false;
                    if (docs) {
                        joke[0].author.hasFollowed = true;
                    }
                    return cb(null, joke[0]);
                });
            }
        }, function(cb) {
            joke[0].isCollected = false;
            var query = {userid: req.session.user._id, jokeid: joke[0]._id};
            collectproxy.getCollectionByQuery(query, {}, function(err, docs) {
                if (docs && docs.length > 0) {
                    joke[0].isCollected = true;
                }
                cb(null, joke[0]);
            });
        }], function(err, result) {
            if (err) return next(err);
            if (notificationid) {
                notificationproxy.getNotificationById(notificationid, function(err, notification) {
                    if (err) return next(err);
                    if (notification.hasread === false) {
                        notification.hasread = true;
                        notification.save(function(err) {
                            if (err) return next(err);
                            return res.render('joke/index', {joke: result[2]});
                        });
                    } else {
                        return res.render('joke/index', {joke: result[2]});
                    }
                });
            } else {
                return res.render('joke/index', {joke: result[1]});
            }
        });
    });
};

exports.create = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    //前端设置 只有添加图片 或者 填写content之后 才可以点击button提交
    //否则禁用button
    var content = req.body.content || '';
    var link = req.body.link || '';
    var photos = req.files;
    var video = req.body.video || '';
    var question = req.body.question || '';
    var answer = req.body.answer || '';
    var select = req.body.select || 0;
    var attachtype = 'text';


    if (content === '' && !photos && link === '' && video === '') {
        return res.json({status: 'fail', error: '分享内容不能为空'});
    }
    if (Object.keys(photos).length > 0) {
        attachtype = 'photo';
    }
    if (link !== '') {
        attachtype = 'link';
    }
    if (video !== '') {
        attachtype = 'video';
    }
    content = validator.trim(content);
    content = validator.escape(content);



    select = parseInt(select);
    if (select !== 0) {
        if (question === '' || answer === '') {
            return res.json({status: 'fail', error: '请填写你的问题和答案'});
        }
    }
    if (link !== '' && !validator.isURL(link)) {
        return res.json({status: 'fail', error: '不正确的链接地址'});
    }
    if (video !== '') {
        if (video.indexOf('<embed src=') === -1) {
            if (video.indexOf('<iframe ') === -1) {
                if (video.indexOf('http://')===-1 || video.indexOf('.swf')===-1) {
                    return res.json({status: 'fail', error: '不正确的视频地址'});
                }
            }
        }
    }
    link = validator.trim(link);
    video = validator.trim(video);
    question = validator.trim(question);
    answer = validator.trim(answer);
    //上传图片处理

    async.waterfall([function(callback) {
        authproxy.getUserById(req.session.user._id, function(err, user) {
            if (err) return next(err);
            if (user) {
                callback(null, user);
            }
        });
    }, function(user, callback) {
        if (photos && Object.keys(photos).length > 0) {
            //var photoArray = [];
            var count = Object.keys(photos).length;

            var dateStamp = Date.now().toString();
            var phoDir = path.join(config.uploadDir, dateStamp, user.name);

            ndir.mkdir(phoDir, function(err) {
                if (err) return next(err);
                async.times(count, function(n,cb) {
                    var key = Object.keys(photos)[n];
                    var photo = photos[key];
                    var filename = Date.now() + n + '_' + photo.originalname;
                    var savepath = path.resolve(path.join(phoDir, filename));
                    var photoUrl = config.siteStaticDir
                    + '/uploads/'
                    + dateStamp
                    + '/' + user.name
                    + '/' + filename;
                    photo.url = photoUrl;
                    photo.author = user;
                    //photoArray.push(photo);

                    fs.rename(photo.path, savepath, function(err) {
                        if (err) return next(err);
                        cb(null, photo);
                    });
                }, function(err, photoArray){
                    callback(null, photoArray)
                });
            });
        } else {
            callback(null, user);
        }
    }], function(err, result) {
        if (err) return next(err);
        if (util.isArray(result)) {
            if (result.length > 0) {
              jokeproxy.createNewJoke(result[0].author._id, content, link, video, result, attachtype, select, question, answer, function(err) {
                  if (err) return next(err);
                  return res.json({status: 'success'});
              });
            }

        } else {
           jokeproxy.createNewJoke(result._id, content, link, video, [], attachtype, select, question, answer, function(err) {
               if (err) return next(err);
               return res.redirect('/');
           });
        }
    });
};

exports.postLike = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    var jokeid = req.body.jokeid;
    var action = req.body.action;
    if (!jokeid) {
        return res.send(403);
    }
    jokeproxy.getJokeById(jokeid, function(err, joke) {
        if (err) return next(err);
        if (!joke) {
            return res.send(403);
        }
        if (action === 'like') {
          joke.like_count++;
          joke.save(function(err) {
              if (err) return next(err);
              likeproxy.likeNewAndSave(joke._id, req.session.user._id, 'like', function(err) {
                  if (err) return next(err);
                  return res.json({status: 'success', like_count: joke.like_count});
              });
          });
        } else {
            joke.like_count = joke.like_count -1 || 0;
            joke.save(function(err) {
                if (err) return next(err);
                var option = {jokeid: joke._id, userid: req.session.user._id, type: 'like'};
                likeproxy.likeRemove(option, function(err) {
                    if (err) return next(err);
                    return res.json({status: 'success', like_count: joke.like_count});
                });
            });
        }
    });
};

exports.postDislike = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    var jokeid = req.body.jokeid;
    var action = req.body.action;
    if (!jokeid) {
        return res.send(403);
    }
    jokeproxy.getJokeById(jokeid, function(err, joke) {
        if (err) return next(err);
        if (!joke) {
            return res.send(403);
        }
        if (action === 'dislike') {
            joke.dislike_count++;
            joke.save(function(err) {
                if (err) return next(err);
                likeproxy.likeNewAndSave(joke._id, req.session.user._id, 'dislike', function(err) {
                    if (err) return next(err);
                    return res.json({status: 'success', dislike_count: joke.dislike_count});
                });
            });
        } else {
            joke.dislike_count = joke.dislike_count -1 || 0;
            joke.save(function(err) {
                if (err) return next(err);
                var option = {jokeid: joke._id, userid: req.session.user._id, type: 'dislike'};
                likeproxy.likeRemove(option, function(err) {
                    if (err) return next(err);
                    return res.json({status: 'success', dislike_count: joke.dislike_count});
                });
            });
        }
    });
};