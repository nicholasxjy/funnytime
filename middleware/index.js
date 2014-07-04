var authproxy = require('../proxy/auth');
var formatfun = require('../utility/formatfun');
var config = require('../config');
var followproxy = require('../proxy/follow');
var jokeproxy = require('../proxy/joke');

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
        var query1 = {userid: req.session.user._id};
        var query2 = {followid: req.session.user._id};
        followproxy.getFollowByQuery(query1, function(err, docs1) {
            if (err) return next(err);
            if (docs1) {
                res.locals.follow_count = docs1.length;
            }
            followproxy.getFollowByQuery(query2, function(err, docs2) {
                if (err) return next(err);
                if (docs2) {
                    res.locals.befollow_count = docs2.length;
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
}