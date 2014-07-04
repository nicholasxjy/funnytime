var async = require('async');
var Joke = require('../models').Joke;
var authproxy = require('./auth');
var commentproxy = require('./comment');
var formatfun = require('../utility/formatfun');

exports.getJokeById = function(jokeid, callback) {
    var query = Joke.where({_id: jokeid});
    query.findOne(callback);
};

exports.getJokesByUser = function(userid, option, callback) {
    Joke.find({authorid: userid}, {}, option, function(err, docs) {
        if (err) return callback(err);
        if (docs) {
            for(var i = 0; i < docs.length; i++) {
                docs[i].friendly_create_time = formatfun.formatDate(docs[i].createtime, true);
            }
            return callback(null, docs);
        }
    });
};

exports.getJokesByQuery = function(query, option, callback) {
    Joke.find(query, {}, option, function(err, docs) {
        //将author得到 绑定于joke
        if (err) return callback(err);
        if (!docs || docs.length === 0) {
            return callback(null, []);
        }
        var count = docs.length;
        async.parallel([
                function(cb) {
                    async.times(count, function(n, next) {
                        authproxy.getUserById(docs[n].authorid, function(err, user) {
                            user.friendly_createtime = formatfun.formatDate(user.createtime, true);
                            var author = {
                                _id: user._id,
                                name: user.name,
                                friendly_createtime: user.friendly_createtime,
                                profile: user.profile,
                                gravatar: user.gravatar

                            };
                            docs[n].author = author;
                            next(err, docs[n]);
                        });
                    }, function(err, authors) {
                        cb(err, authors);
                    });
                },
                function(cb) {
                   async.times(count, function(n, next) {
                    var query = {jokeid: docs[n]._id};
                    var option = {limit: 5, sort: {createtime: 'desc'}};
                    commentproxy.getCommentsByQuery(query, option, function(err, comments) {
                        for(var i = 0; i < comments.length; i++) {
                            comments[i].friendly_createtime = formatfun.formatDate(comments[i].createtime, true);
                        }
                        docs[n].comments = comments;
                        next(err, docs[n]);
                    });
                   }, function(err, comments) {
                       cb(err, comments)
                   });
                }

            ], function(err, result) {
                if (err) return callback(err);
                var jokes = result[1];
                for(var i = 0; i < jokes.length; i++) {
                    jokes[i].friendly_createtime = formatfun.formatDate(jokes[i].createtime, true);
                }
                return callback(null, jokes);
            }
        );
    });
}

exports.createNewJoke = function(authorid, content, link, video, photos, attachtype, select, question, answer, callback) {
    var joke = new Joke();
    joke.authorid = authorid;
    joke.content = content;
    joke.link = link;
    joke.video = video;
    joke.photos = photos;
    joke.attachtype = attachtype;
    joke.question = question;
    joke.answer = answer;
    joke.save(callback);
};