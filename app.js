var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');
var routes = require('./routes/index');
var config = require('./config');
var middleware = require('./middleware');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '500kb'}));
app.use(bodyParser.urlencoded({limit: '500kb'}));
app.use(multer({dest: config.uploadDir}));
app.use(cookieParser());

app.use(session({
    secret: config.session_secret,
    key: 'sid',
    store: new MongoStore({
        db: config.dbname
    })
}));
// cookie auth middleware
app.use(middleware.authUser);
app.use(middleware.followCount);
app.use(middleware.jokesCount);
app.use(middleware.userNotificationsCount);
app.use(middleware.getHotShares);
app.use(express.static(path.join(__dirname, 'public')));

app.set('view cache', true);

routes(app);

/// error handlers
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
