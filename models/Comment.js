var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
    jokeid: {type: ObjectId},
    replyto: {type: ObjectId},
    authorid: {type: ObjectId},
    content: {type: String},
    like_count: {type: Number, default: 0},
    dislike_count: {type: Number, default: 0},
    createtime: {type: Date, default: Date.now}
});

mongoose.model('Comment', CommentSchema);