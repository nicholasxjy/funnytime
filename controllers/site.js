var config = require('../config');
var jokeproxy = require('../proxy/joke');
var likeproxy = require('../proxy/likerelation');
var collectproxy = require('../proxy/collection');
var _ = require('underscore');
var async = require('async');

exports.index = function(req, res, next) {
    if (!req.session.user) {
        return res.render('index');
    }
    var page = parseInt(req.query.page, 10) || 1;
    var limit = config.page_with_item;
    var option = {skip: (page -1)*limit, limit: limit, sort: {createtime: 'desc'}};
    jokeproxy.getJokesByQuery({}, option, function(err, jokes) {
        if (err) return next(err);
        async.waterfall([function(cb) {
            likeproxy.getLikeRelationByQuery({userid: req.session.user._id}, function(err, docs) {
                if (err) return next(err);
                if (!docs || docs.length === 0) {
                    //return res.render('index', {jokes: jokes, cpage: page});
                    cb(null, jokes);
                }
                //console.log(docs);
                for(var i = 0, len = jokes.length; i < len; i++) {
                    var items = [];
                    for(var k = 0; k < docs.length; k++) {
                        if (docs[k].jokeid.toString() === jokes[i]._id.toString()) {
                            items.push(docs[k]);
                        }
                    }
                    //var items = _.where(docs, {jokeid: jokes[i]._id, userid: req.session.user._id});
                    //console.log(items);
                    jokes[i].isLike = false;
                    jokes[i].isDislike = false;
                    if (items && items.length > 0) {
                        for(var j = 0 ; j < items.length; j++) {
                            if (items[j].type === 'like') jokes[i].isLike = true;
                            if (items[j].type === 'dislike') jokes[i].isDislike = true;
                        }
                    }
                }
                //console.log(jokes);
                cb(null, jokes);
                //return res.render('index', {jokes: jokes, cpage: page});
            });
        }, function(jokes1, cb) {
            var count = jokes1.length;
            async.times(count, function(n, cbchild) {
                jokes1[n].isCollected = false;
                var query = {userid: req.session.user._id, jokeid: jokes1[n]._id};
                collectproxy.getCollectionByQuery(query, {}, function(err, docs) {
                    if (docs && docs.length > 0) {
                        jokes1[n].isCollected = true;
                    }
                    cbchild(null, jokes1[n]);
                });
            }, function(err, preresult) {
                if (err) return next(err);
                cb(null, jokes1);
            });
        }], function(err, result) {
            if (err) return next(err);
            return res.render('index', {jokes: result, cpage: page});
        });
    });
};