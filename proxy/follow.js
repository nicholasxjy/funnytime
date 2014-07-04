var Follow = require('../models').Follow;

exports.followNewAndSave = function(userid, followid, callback) {
    var follow = new Follow;
    follow.userid = userid;
    follow.followid = followid;
    follow.save(callback);
};

exports.removeFollow = function(userid, followid, callback) {
    Follow.remove({userid: userid, followid: followid}, callback);
};

exports.getFollowByQuery = function(query, callback) {
    Follow.find(query, callback);
};