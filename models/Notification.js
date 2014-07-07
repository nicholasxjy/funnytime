var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var NotificationSchema = new Schema({
    type: {type: String},
    masterid: {type: ObjectId},
    authorid: {type: ObjectId},
    jokeid: {type: ObjectId},
    commentid: {type: ObjectId},
    hasread: {type: Boolean, default: false},
    createtime: {type: Date, default: Date.now}

});

mongoose.model('Notification', NotificationSchema);