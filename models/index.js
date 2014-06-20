var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.dburl, function(err) {
    if (err) {
        console.log("connect db err: " + err.message);
        process.exit(1);
    }
});

require('./User');
require('./Joke');
exports.User = mongoose.model('User');
exports.Joke = mongoose.model('Joke');