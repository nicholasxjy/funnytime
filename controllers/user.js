var authproxy = require('../proxy/auth');
var jokeproxy = require('../proxy/joke');
var config = require('../config');
var formatfun = require('../utility/formatfun');
var followproxy = require('../proxy/follow');

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
            if (docs) {
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
            return res.json({status: 'success'});
        });
    } else {
        followproxy.removeFollow(userid, req.session.user._id, function(err) {
            if (err) return next(err);
            return res.json({status: 'success'});
        });
    }
};