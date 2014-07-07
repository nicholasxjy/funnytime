var validator = require('validator');
var commentproxy = require('../proxy/comment');
var authproxy = require('../proxy/auth');
var notificationproxy = require('../proxy/notification');
var config = require('../config');

exports.create = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    var user = req.session.user;
    var jokeid = req.body.jokeid;
    var toid = req.body.toid;
    var userid = user._id;
    if (!jokeid || !toid || !userid) {
        return res.send(403);
    }
    var content = req.body.content;
    content = validator.trim(content);
    content = validator.escape(content);
    authproxy.getUserById(user._id, function(err, doc) {
        if (err) return next(err);
        if (doc) {
            commentproxy.commentCreateNew(jokeid, toid, doc._id, content, function(err, newcomment) {
                if (err) return next(err);
                var creator = {
                    name: doc.name,
                    userid: doc._id,
                    gravatar: doc.gravatar //todo modify the url  doc.gravatar
                };
                var data = {type: 'comment', masterid: toid, authorid: doc._id, jokeid: jokeid, commentid: newcomment._id};
                notificationproxy.notificationNewAndSave(data, function(err) {
                    if (err) return next(err);
                    return res.json({status: 'success', info: creator});
                });
            });
        }
    });
};