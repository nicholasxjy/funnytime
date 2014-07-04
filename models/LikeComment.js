var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var LikeComment = new Schema({
    jokeid: {type: ObjectId},
    authorid: {type: ObjectId},
    type: {type: String},
    fromid: {type: ObjectId},
    createtime: {type: Date, default: Date.now}
});
mongoose.model('LikeCommentRelation', LikeComment);