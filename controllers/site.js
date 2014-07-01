var config = require('../config');
var jokeproxy = require('../proxy/joke');

exports.index = function(req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    var limit = config.page_with_item;
    var option = {skip: (page -1)*limit, limit: limit, sort: {createtime: 'desc'}};
    jokeproxy.getJokesByQuery({}, option, function(err, jokes) {
        if (err) return next(err);
        return res.render('index', {jokes: jokes, cpage: page});
    });
};