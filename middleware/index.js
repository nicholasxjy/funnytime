var async = require('async');
var authproxy = require('../proxy/auth');
var formatfun = require('../utility/formatfun');
var config = require('../config');
var followproxy = require('../proxy/follow');
var jokeproxy = require('../proxy/joke');
var notificationproxy = require('../proxy/notification');
var cryptofun = require('../utility/cryptofun');

exports.authUser = function(req, res, next) {
    var sess = req.session;
    if (sess && sess.user) {
        authproxy.getUserById(req.session.user._id, function(err, user) {
            if (err) return next(err);
            if (user) {
                user.format_create_time = formatfun.formatDate(user.createtime, true);
                sess.user = user;
                res.locals.c_user = user;
                return next();
            } else {
                return next();
            }
        });
    } else {
        var authcookie = req.cookies[config.cookieName];
        if (!authcookie) {
            return next();
        }
        var cookieToken = cryptofun.decryt(authcookie, config.session_secret);
        var userid = cookieToken.split('||')[0];
        authproxy.getUserById(userid, function(err, user) {
            if (err) return next(err);
            if (user) {
                user.format_create_time = formatfun.formatDate(user.createtime, true);
                sess.user = user;
                res.locals.c_user = user;
                return next();
            } else {
                return next();
            }
        });
    }
};

exports.followCount = function(req, res, next) {
    if (req.session.user) {
        var query1 = {userid: req.session.user._id};//查出粉丝
        var query2 = {followid: req.session.user._id};//关注的人
        followproxy.getFollowByQuery(query1, function(err, docs1) {
            if (err) return next(err);
            if (docs1) {
                res.locals.befollow_count = docs1.length;
            }
            followproxy.getFollowByQuery(query2, function(err, docs2) {
                if (err) return next(err);
                if (docs2) {
                    res.locals.follow_count = docs2.length;
                    return next();
                } else {
                    return next();
                }
            });
        });
    } else {
        return next();
    }
};

exports.jokesCount = function(req, res, next) {
    if (req.session.user) {
        jokeproxy.getJokesByUser(req.session.user._id, {}, function(err, jokes) {
            if (err) return next(err);
            if (jokes) {
                res.locals.jokes_count = jokes.length;
                return next();
            } else {
                return next();
            }
        });
    } else {
        return next();
    }
};


exports.userFollowCount = function(req, res, next) {
    var username = req.params.name;
    if (!username) {
        return next();
    }
    authproxy.getUserByName(username, function(err, user) {
        if (err) return next(err);
        if (user) {
            var query1 = {userid: user._id};//查出粉丝
            var query2 = {followid: user._id};//关注的人
            followproxy.getFollowByQuery(query1, function(err, docs1) {
                if (err) return next(err);
                if (docs1) {
                    res.locals.user_befollow_count = docs1.length || 0;
                }
                followproxy.getFollowByQuery(query2, function(err, docs2) {
                    if (err) return next(err);
                    if (docs2) {
                        res.locals.user_follow_count = docs2.length || 0;
                        return next();
                    } else {
                        return next();
                    }
                });
            });
        } else {
            return next();
        }
    });
};

exports.userJokesCount =  function(req, res, next) {
    var username = req.params.name;
    if (!username) {
        return next();
    }
    authproxy.getUserByName(username, function(err,user) {
        if (err) return next(err);
        if (user) {
            jokeproxy.getJokesByUser(user._id, {}, function(err, jokes) {
                if (err) return next(err);
                if (jokes) {
                    res.locals.user_jokes_count = jokes.length || 0;
                    return next();
                } else {
                    return next();
                }
            });
        } else {
            return next();
        }
    });
};

exports.userNotificationsCount = function(req, res, next) {
    if (!req.session.user) {
        return next();
    }
    var query = {masterid: req.session.user._id, hasread: false};
    notificationproxy.getNotificationsByQuery(query, {}, function(err, docs) {
        if (err) return next(err);
        res.locals.user_notifications_count = docs.length;
        return next();
    });
};

exports.getHotShares = function(req, res, next) {
    var limit = config.hot_limit;
    var option = {sort: {like_count: 'desc'}, limit: limit};
    jokeproxy.getHotJokes({}, option, function(err, hots) {
        if (err) return next(err);
        if (hots.length > 0) {
            var count = hots.length;
            async.times(count, function(n, cb) {
                authproxy.getUserById(hots[n].authorid, function(err, user) {
                   if (err) return next(err);
                   hots[n].author = user;
                   cb(null, hots[n]);
                });
            }, function(err, results) {
                if (err) return next(err);
                res.locals.hots = results;
                return next();
            });
        } else {
            return next();
        }
    });
};