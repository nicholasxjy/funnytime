var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');
var site = require('../controllers/site');
var joke = require('../controllers/joke');
/* GET home page. */
router.get('/', site.index);


router.get('/joke/:jokeid', joke.index);
router.post('/joke/create', joke.create);

router.get('/signup', auth.showSignup);
router.post('/signup', auth.postSignup);
router.get('/signin', auth.showSignin);
router.post('/signin', auth.postSignin);
router.get('/forget-pass', auth.showForgetPass);
router.post('/forget-pass', auth.postForgetPass);

router.get('/reset-pass', auth.showResetPass);
router.post('/reset-pass', auth.postResetPass);

module.exports = router;
