var User = require('../models').User;

exports.createNewUser = function(name, email, pass, callback) {
    var user = new User();
    user.name = name;
    user.email = email;
    user.password = pass;

    user.save(callback);
};

exports.getUsersByQuery = function(query, opts, callback) {
    User.find(query, {}, opts, callback);
};

exports.getUserByName = function(name, callback) {
    var query = User.where({name: name});
    query.findOne(callback);
}