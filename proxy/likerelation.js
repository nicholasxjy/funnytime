var Like = require('../models').LikeRelation;

exports.likeNewAndSave = function(jokeid, userid, type, callback) {
    var like = new Like;
    like.jokeid = jokeid;
    like.userid = userid;
    like.type = type;
    like.save(callback);
};

exports.likeRemove = function(option, callback) {
    Like.remove(option, callback);
};

exports.getLikeRelationByQuery = function(query, callback) {
    Like.find(query, callback);
};