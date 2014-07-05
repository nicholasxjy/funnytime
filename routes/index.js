var auth = require('../controllers/auth');
var site = require('../controllers/site');
var joke = require('../controllers/joke');
var comment = require('../controllers/comment');
var user = require('../controllers/user');
var middleware = require('../middleware');
module.exports = function(app) {
    /* GET home page. */
    app.get('/', site.index);
    app.get('/forget-pass', auth.showForgetPass);
    app.post('/forget-pass', auth.postForgetPass);

    //app.get('/reset-pass', auth.showResetPass);
    //app.post('/reset-pass', auth.postResetPass);


    app.post('/signin', auth.postSignin);
    app.post('/signup', auth.postSignup);

    app.get('/signout', auth.signOut);

    app.post('/create/new', joke.create);
    app.post('/comment/new', comment.create);

    app.get('/settings/profile', auth.showProfile);
    app.post('/settings/profile', auth.postProfile);

    app.get('/settings/gravatar', auth.showGravatar);
    app.post('/settings/gravatar', auth.postGravatar);

    app.get('/settings/reset-pass', auth.showSettingResetPass);
    app.post('/settings/reset-pass', auth.postSettingResetPass);

    app.get('/u/:name', middleware.userFollowCount, middleware.userJokesCount, user.index);

    app.post('/joke/like', joke.postLike);
    app.post('/joke/dislike', joke.postDislike);

    app.post('/u/follow', user.postFollow);
}
