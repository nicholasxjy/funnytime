var async = require('async');
var Comment = require('../models').Comment;
var authproxy = require('./auth');

exports.getCommentsByJokeId = function(jokeid, callback) {
    var option = {sort: {createtime: 'desc'}};
    Comment.find({jokeid: jokeid}, {}, option, function(err, docs) {
        if (err) return callback(err);
        if (!docs || docs.length === 0) {
            return callback(null, []);
        }
        var count = docs.length;
        async.times(count, function(n, cb) {
            setTimeout(function() {
               authproxy.getUserById(docs[n].authorid, function(err, user) {
                if (err) return cb(err);
                var author = {
                    _id: user._id,
                    name: user.name,
                    profile: user.profile,
                    gravatar: user.gravatar

                };
                docs[n].author = author;
                cb(null, docs[n]);
               });
            }, (n+1)*100);
        }, function(err, comments) {
            if (err) return callback(err);
            return callback(null, comments);
        });
    });
};

exports.commentCreateNew = function(jokeid, replyto, authorid, content, callback) {
    var comment = new Comment();
    comment.jokeid = jokeid;
    comment.replyto = replyto;
    comment.authorid = authorid;
    comment.content = content;
    comment.save(function(err) {
        if (err) return callback(err);
    });
};