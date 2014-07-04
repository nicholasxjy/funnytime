var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FollowSchema = new Schema({
    userid: {type: ObjectId}, //被关注的人的id
    followid: {type: ObjectId}, //关注人的id
    createtime: {type:Date, default: Date.now}
});

mongoose.model('Follow', FollowSchema);