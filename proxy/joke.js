var async = require('async');
var Joke = require('../models').Joke;
var authproxy = require('./auth');
var commentproxy = require('./comment');

exports.getJokeById = function(jokeid, callback) {
    var query = Joke.where({_id: jokeid});
    query.findOne(callback);
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
                             docs[n]._doc.author = user;
                             next(err, docs[n]);
                        });
                    }, function(err, authors) {
                        cb(err, authors);
                    });
                },
                function(cb) {
                   async.times(count, function(n, next) {
                    commentproxy.getCommentsByJokeId(docs[n]._id, function(err, comments) {
                        docs[n]._doc.comments = comments;
                        next(err, docs[n]);
                    });
                   }, function(err, comments) {
                       cb(err, comments)
                   });
                }

            ], function(err, result) {
                if (err) return callback(err);
                return callback(null, result[1]);
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