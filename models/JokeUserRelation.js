var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var JokeUserSchema = new Schema({
    jokeid: {type: ObjectId},
    userid: {type: ObjectId},
    createtime: {type: Date, default: Date.now}
});

mongoose.model('JokeUserRelation', JokeUserSchema);