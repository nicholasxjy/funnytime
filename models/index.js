var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.dburl, function(err) {
    if (err) {
        console.log("connect db err: " + err.message);
        process.exit(1);
    }
});

require('./User');
require('./Joke');
require('./LikeRelation');
require('./Follow');
require('./JokeUserRelation');
require('./Comment');
require('./LikeComment');
require('./Notification');
require('./Collection');
exports.User = mongoose.model('User');
exports.Joke = mongoose.model('Joke');
exports.LikeRelation = mongoose.model('LikeRelation');
exports.Follow = mongoose.model('Follow');
exports.Public = mongoose.model('JokeUserRelation');
exports.Comment = mongoose.model('Comment');
exports.LikeCommentRelation = mongoose.model('LikeCommentRelation');
exports.Notification = mongoose.model('Notification');
exports.Collection = mongoose.model('Collection');