var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/users', function(req, res) {
    res.send('Hello users');
});

router.get('/jokes', function(req, res) {
    res.send('Hello jokes');
});

router.post('/joke/create', function(req, res) {
    var name = req.body.name;
    res.send('Your name: ' + name);
});


router.get('/signup', auth.showSignup);
router.post('/signup', auth.postSignup);
router.get('/signin', auth.showSignin);
router.post('/signin', auth.postSignin);


module.exports = router;
