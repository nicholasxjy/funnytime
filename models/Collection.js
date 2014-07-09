var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CollectionSchema = new Schema({
    userid: {type: ObjectId},
    jokeid: {type: ObjectId},
    createtime: {type: Date, default: Date.now}
});

mongoose.model('Collection', CollectionSchema);