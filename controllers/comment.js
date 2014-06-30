var validator = require('validator');
var commentproxy = require('../proxy/comment');
var authproxy = require('../proxy/auth');

exports.create = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    var user = req.session.user;
    var jokeid = req.body.jokeid;
    var toid = req.body.toid;
    var userid = user._id;
    if (!jokeid || !toid || !userid) {
        return res.send(500);
    }
    var content = req.body.content;
    content = validator.trim(content);
    content = validator.escape(content);
    authproxy.getUserById(user._id, function(err, doc) {
        if (err) return next(err);
        commentproxy.commentCreateNew(jokeid, toid, doc._id, content, function(err) {
            if (err) return next(err);
            var creator = {
                name: doc.name,
                userid: doc._id,
                gravatar: doc.gravatar
            };
            return res.json({status: 'success', info: creator});
        });
    })
}