var config = require('../config');
var async = require('async');
var validator = require('validator');
var cryptofun = require('../utility/cryptofun');
var authproxy = require('../proxy/auth');
var mail = require('../services/mail');
var User = require('../models').User;

exports.showSignup = function(req, res) {
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    return res.render('auth/signup');
};

exports.postSignup = function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.pass;
    var repass = req.body.repass;
    if (name === '' || email === '' || pass === '' || repass === '') {
        return res.render('auth/signup', {error: '信息不完整'});
    }
    name = validator.trim(name);
    email = validator.trim(email);
    if (!validator.isAlphanumeric(name)) {
        return res.render('auth/signup', {error: '用户名只允许字母和数字'});
    }
    if (!validator.isEmail(email)) {
        return res.render('auth/signup', {error: '请填写正确的邮箱地址'});
    }

    if (!validator.isAlphanumeric(pass) || !validator.isAlphanumeric(repass)) {
        return res.render('auth/signup', {error: '密码只允许字母和数字'});
    }

    if (pass !== repass) {
        return res.render('auth/signup', {error: '两次密码不一致'});
    }
    User.getUsersByQuery({'$or': [{'name': name}, {'email': email}]}, {}, function(err, users) {
        if (err) return next(err);
        if (users && users.length > 0) {
            return res.render('auth/signup', {error: '用户名或邮箱已被使用'});
        }
    });
    pass = cryptofun.md5Crypto(pass);
    authproxy.createNewUser(name, email, pass, function(err) {
        if (err) return next(err);
        var token = cryptofun.md5Crypto(email + config.session_secret);
        //发送激活邮件通知
        mail.sendActiveMail(email, token, name);

        return res.render('auth/signup', {success: '欢迎来到 ' + config.sitename +
            '我们给你的注册邮箱发送了一份激活邮件，请点击其中连接以激活您的帐号。'});
    });
};

exports.showSignin = function(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    return res.render('auth/signin');
}

exports.postSignin = function(req, res, next) {
    var name = req.body.name;
    var pass = req.body.pass;
    if (name === '' || pass === '') {
        return res.render('auth/signin', {error: '请填写用户名和密码'});
    }
    authproxy.getUserByName(name, function(err, user) {
        if (err) return next(err);
        if (!user) {
            return res.render('auth/signin', {error: '该用户不存在！'});
        }
        pass = cryptofun.md5Crypto(pass);
        if (pass !== user.password) {
            return res.render('auth/signin', {error: '密码错误'});
        }
        //没激活  再次发送激活邮件
        if (!user.active) {
            var token = cryptofun.md5Crypto(user.email + config.session_secret);
            mail.sendActiveMail(user.email, token, user.name);
            return res.render('auth/signin', {error: '此帐号还没有激活，激活链接已发送到您的邮箱 '
                + user.email + ' 请及时查收'});
        }
        //设置cookie
        var cookieToken = cryptofun.encryt(user._id + '||' + user.name + '||'
            + user.email + '||' + user.password, config.session_secret);
        res.cookie(config.cookieName, cookieToken, {path: '/', maxAge: config.cookieAge});
        res.session.user = user;
        return res.redirect('/');
    });

};

exports.activeAccount = function(req, res, next) {
    var key = req.query.key;
    var name = req.query.name;
    if (key === '' || name === '') {
        return res.send(500, 'There is some error');
    }
    authproxy.getUserByName(name, function(err, user) {
        if (err) return next(err);
        if (!user) {
            return res.send(500, 'Something wrong here.');
        }
        if (user.active) {
            return res.render('notify/notify', {error: '此帐号已经被激活。'});
        }
        var activeKey = cryptofun.md5Crypto(user.email + config.session_secret);
        if (key === activeKey) {
            user.active = true;
            user.save(function(err) {
                if (err) return next(err);
                return res.render('notify/notify', {success: '此帐号成功被激活.'});
            });
        }
    });
}