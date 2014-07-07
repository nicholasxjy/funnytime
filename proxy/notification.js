var Notification = require('../models').Notification;

exports.notificationNewAndSave = function(data, callback) {
    var notification = new Notification;
    notification.type = data.type;
    notification.masterid = data.masterid;
    notification.authorid = data.authorid;
    notification.jokeid = data.jokeid;
    notification.commentid = data.commentid;
    notification.save(callback);
};
exports.getNotificationById = function(id, callback) {
    Notification.findOne({_id: id}, callback);
};

exports.getNotificationsByQuery = function(query, option, callback) {
    Notification.find(query, {}, option, callback);
};

exports.getNotificationsByMasterId = function(masterid, callback) {
    Notification.find({masterid: masterid}, callback);
};