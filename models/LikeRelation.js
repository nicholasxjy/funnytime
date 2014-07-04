var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var LikeRelationSchema = new Schema({
    jokeid: {type: ObjectId},
    userid: {type: ObjectId},
    type: {type: String}, //'like' 'dislike'
    createtime: {type: Date, default: Date.now}
});

mongoose.model('LikeRelation', LikeRelationSchema);