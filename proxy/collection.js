var Collection = require('../models').Collection;

exports.createNewAndSave = function(userid, jokeid, callback) {
    var collect = new Collection;
    collect.userid = userid;
    collect.jokeid = jokeid;
    collect.save(callback);
};

exports.getCollectionByQuery = function(query, option, callback) {
    Collection.find(query, {}, option, callback);
};

exports.removeCollectionByQuery = function(query, callback) {
    Collection.remove(query, callback);
};