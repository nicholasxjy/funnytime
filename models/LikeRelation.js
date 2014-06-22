var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var LikeRelationSchema = new Schema({
    jokeid: {type: ObjectId},
    userid: {type: ObjectId}
});

mongoose.model('LikeRelation', LikeRelationSchema);