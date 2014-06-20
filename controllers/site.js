var config = require('../config');


exports.index = function(req, res, next) {
    res.render('index', {title: 'Express'});
}