var config = require('../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var JokeSchema = new Schema({
    authorid: {type: ObjectId},
    content: {type: String, index: true},
    photos: {type: Array},
    link: {type: String},
    video: {type: String},// sort of video tag of html
    question: {type: String},
    answer: {type: String},
    attachtype: {type: String},
    select: {type: Number, default: 0},
    reply_count: {type: Number, default: 0},
    like_count: {type: Number, default: 0},
    createtime: {type: Date, default: Date.now}
});

mongoose.model('Joke', JokeSchema);