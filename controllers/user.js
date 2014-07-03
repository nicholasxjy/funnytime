var authproxy = require('../proxy/auth');
var jokeproxy = require('../proxy/joke');
var config = require('../config');
var formatfun = require('../utility/formatfun');

exports.index = function(req, res, next) {
    var username = req.params.name;
    var page = parseInt(req.query.page, 10) || 1;
    var limit = config.user_page_limit;
    var option = {skip: (page -1)*limit, limit: limit, sort: {createtime: 'desc'}};
    if (!username) {
        return res.send(404);
    }
    authproxy.getUserByName(username, function(err, user) {
        if (err) return next(err);
        user.format_create_time = formatfun.formatDate(user.createtime, true);
        jokeproxy.getJokesByUser(user._id, option, function(err, jokes) {
            if (err) return next(err);
            if (jokes) {
                return res.render('user/index', {jokes: jokes, user: user, isuserpage: true});
            }
        });
    });
}