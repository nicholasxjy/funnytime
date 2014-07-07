var async = require('async');
var authproxy = require('../proxy/auth');
var jokeproxy = require('../proxy/joke');
var config = require('../config');
var formatfun = require('../utility/formatfun');
var followproxy = require('../proxy/follow');
var notificationproxy = require('../proxy/notification');
var commentproxy = require('../proxy/comment');

exports.index = function(req, res, next) {
    var username = req.params.name;
    var page = parseInt(req.query.page, 10) || 1;
    var limit = config.user_page_limit;
    var option = {skip: (page -1)*limit, limit: limit, sort: {createtime: 'desc'}};
    if (!username) {
        return res.send(404);
    }
    authproxy.getUserByName(username, function(err, user) {
        if (err) return next(err);
        user.format_create_time = formatfun.formatDate(user.createtime, true);
        var query = {userid: user._id, followid: req.session.user._id};
        followproxy.getFollowByQuery(query, function(err, docs) {
            if (err) return next(err);
            user.hasFollowed = false;
            if (docs && docs.length !== 0) {
                user.hasFollowed = true;
            }
            jokeproxy.getJokesByUser(user._id, option, function(err, jokes) {
                if (err) return next(err);
                if (jokes) {
                    return res.render('user/index', {jokes: jokes, user: user, isuserpage: true});
                }
            });
        });
    });
};

exports.following = function(req, res, next) {
    var username = req.params.name;
    authproxy.getUserByName(username, function(err, user) {
        if (err) return next(err);
        if (!user) {
            return res.send(404);
        }
        user.format_create_time = formatfun.formatDate(user.createtime, true);
        async.waterfall([function(cb) {
            var query0 = {userid: user._id, followid: req.session.user._id};
            followproxy.getFollowByQuery(query0, function(err, docs) {
                if (err) return next(err);
                if (docs && docs.length !== 0) {
                    user.hasFollowed = true;
                }
                cb(null, user);
            });
        }, function(user1, cb) {
            var query = {followid: user._id};
            followproxy.getFollowByQuery(query, function(err, docs) {
                if (err) return next(err);
                cb(null, docs);
            });
        }, function(docs, cb) {
            var count = docs.length;
            async.times(count, function(n, cb) {
                authproxy.getUserById(docs[n].userid, function(err, follow) {
                    if (err) return next(err);
                    follow.isAlsoFollowed = true;
                    cb(null, follow);
                });
            }, function(err, users) {
                if (err) return next(err);
                cb(null, users);
            });
        }], function(err, result) {
            if (err) return next(err);
            return res.render('user/following', {follows: result, user: user, isuserpage: true});
        });
    });
};

exports.followers = function(req, res, next) {
    var username = req.params.name;
    var notificationid = req.query.notificationid;
    authproxy.getUserByName(username, function(err, user) {
        if (err) return next(err);
        if (!user) {
            return res.send(404);
        }
        user.format_create_time = formatfun.formatDate(user.createtime, true);
        async.waterfall([function(cb) {
            var query0 = {userid: user._id, followid: req.session.user._id};
            followproxy.getFollowByQuery(query0, function(err, docs) {
                if (err) return next(err);
                if (docs && docs.length !== 0) {
                    user.hasFollowed = true;
                }
                cb(null, user);
            });
        }, function(user1, cb) {
            var query = {userid: user._id};
            followproxy.getFollowByQuery(query, function(err, docs) {
                if (err) return next(err);
                cb(null, docs);
            });
        }, function(docs, cb) {
            var count = docs.length;
            async.times(count, function(n, cb) {
                authproxy.getUserById(docs[n].followid, function(err, follow) {
                    if (err) return next(err);
                    var query2 = {userid: follow._id, followid: user._id};
                    followproxy.getFollowByQuery(query2, function(err, doc) {
                        if (err) return next(err);
                        if (doc && doc.length !== 0) {
                            follow.isAlsoFollowed = true;
                        }
                        cb(null, follow);
                    });
                });
            }, function(err, users) {
                if (err) return next(err);
                cb(null, users);
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
                            return res.render('user/followers', {follows: result, user: user, isuserpage: true});
                        });
                    } else {
                        return res.render('user/followers', {follows: result, user: user, isuserpage: true});
                    }
                });
            } else {
                return res.render('user/followers', {follows: result, user: user, isuserpage: true});
            }
        });
    });
};

exports.postFollow = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    var userid = req.body.userid;
    var action = req.body.action;
    if (!userid || !action) {
        return res.send(403);
    }
    if (action === 'follow') {
        followproxy.followNewAndSave(userid, req.session.user._id, function(err) {
            if (err) return next(err);
            var query = {userid: userid};
            followproxy.getFollowByQuery(query, function(err, docs) {
                if (err) return next(err);
                var data = {type: 'follow', masterid: userid, authorid: req.session.user._id, jokeid: null, commentid: null};
                notificationproxy.notificationNewAndSave(data, function(err) {
                    if (err) return next(err);
                    return res.json({status: 'success', count: docs.length});
                });
            });
        });
    } else {
        followproxy.removeFollow(userid, req.session.user._id, function(err) {
            if (err) return next(err);
            var query = {userid: userid};
            followproxy.getFollowByQuery(query, function(err, docs) {
                if (err) return next(err);
                return res.json({status: 'success', count: docs.length});
            });
        });
    }
};

exports.showNotifications = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    notificationproxy.getNotificationsByMasterId(req.session.user._id, function(err, docs) {
        if (err) return next(err);
        var count = docs.length;
        async.times(count, function(n, cb) {
            docs[n].friendly_create_time = formatfun.formatDate(docs[n].createtime, true);
            if (docs[n].type === 'follow') {
                authproxy.getUserById(docs[n].authorid, function(err, author) {
                    if (err) return next(err);
                    docs[n].author = author;
                    return cb(null, docs[n]);
                });
            } else if (docs[n].type === 'comment') {
                commentproxy.getCommentsByQuery({_id: docs[n].commentid}, {}, function(err, comment) {
                    if (err) return next(err);
                    docs[n].comment = comment[0];
                    return cb(null, docs[n]);
                });
            }
        }, function(err, result) {
            if (err) return next(err);
            //console.log(result);
            return res.render('user/notifications', {notifications: result});
        });
    });
};

exports.checkNotification = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    var notificationid = req.body.notificationid;
    notificationproxy.getNotificationById(notificationid, function(err, notification) {
        if (err) return next(err);
        notification.hasread = true;
        notification.save(function(err) {
            if (err) return next(err);
            return res.json({status: 'success'});
        });
    });
};

exports.checkAllNotification = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    var query = {masterid: req.session.user._id, hasread: false};
    notificationproxy.getNotificationsByQuery(query, {}, function(err, docs) {
        if (err) return next(err);
        if (docs && docs.length > 0) {
            for(var i = 0, len = docs.length; i < len; i++) {
                docs[i].hasread = true;
            }
            return res.json({status: 'success'});
        } else {
            return res.json({status: 'success'});
        }
    });
};