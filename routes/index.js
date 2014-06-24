var auth = require('../controllers/auth');
var site = require('../controllers/site');
var joke = require('../controllers/joke');


module.exports = function(app) {
    /* GET home page. */
    app.get('/', site.index);
    app.get('/forget-pass', auth.showForgetPass);
    app.post('/forget-pass', auth.postForgetPass);

    app.get('/reset-pass', auth.showResetPass);
    app.post('/reset-pass', auth.postResetPass);


    app.post('/signin', auth.postSignin);
    app.post('/signup', auth.postSignup);


}
