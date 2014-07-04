var Like = require('../models').LikeRelation;

exports.likeNewAndSave = function(jokeid, userid, type, callback) {
    var like = new Like;
    like.jokeid = jokeid;
    like.userid = userid;
    like.type = type;
    like.save(callback);
};