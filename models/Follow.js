var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FollowSchema = new Schema({
    userid: {type: ObjectId},
    followid: {type: ObjectId},
    createtime: {type:Date, default: Date.now}
});

mongoose.model('Follow', FollowSchema);