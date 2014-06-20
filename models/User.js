var mongoose = require('mongoose');
var config = require('../config');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String, index: true},
    email: {type: String, unique: true},
    password: {type: String},
    gender: {type: Number, default: 0},
    gravatar: {type: String, default: config.default_gravatar_url},
    location: {type: Number, default: 0},
    profile: {type: String, default: config.none_profile},
    createtime: {type: Date, default: Date.now},
    active: {type: Boolean, default: false}
});

mongoose.model('User', UserSchema);


