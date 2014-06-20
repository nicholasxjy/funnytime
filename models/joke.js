var config = require('../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var JokeSchema = new Schema({
    authorid: {type: ObjectId},
    content: {type: String, index: true},
    photos: {type: Array},
    link: {type: String},
    reply_count: {type: Number, default: 0},
    like_count: {type: Number, default: 0},
    createtime: {type: Date, default: Date.now}
});

mongoose.model('Joke', JokeSchema);