var config = require('../config');
var async = require('async');
var validator = require('validator');
var cryptofun = require('../utility/cryptofun');
var formatfun = require('../utility/formatfun');
var authproxy = require('../proxy/auth');
var mail = require('../services/mail');

exports.postSignup = function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.pass;
    var repass = req.body.repass;
    if (name === '' || email === '' || pass === '' || repass === '') {
        return res.json({status: 'fail', error: '信息不完整'});
    }
    name = validator.trim(name);
    email = validator.trim(email);
    if (!validator.isAlphanumeric(name)) {
        return res.json({status: 'fail', error: '用户名只允许字母和数字'});
    }
    if (!validator.isEmail(email)) {
        return res.json({status: 'fail', error: '请填写正确的邮箱地址'});
    }

    if (!validator.isAlphanumeric(pass) || !validator.isAlphanumeric(repass)) {
        return res.json({status: 'fail', error: '密码只允许字母和数字'});
    }

    if (pass !== repass) {
        return res.json({status: 'fail', error: '两次密码不一致'});
    }
    authproxy.getUsersByQuery({'$or': [{'name': name}, {'email': email}]}, {}, function(err, users) {
        if (err) return next(err);
        if (users && users.length > 0) {
            return res.json({status: 'fail', error: '用户名或邮箱已被使用'});
        }
    });
    pass = cryptofun.md5Crypto(pass);
    authproxy.createNewUser(name, email, pass, function(err) {
        if (err) return next(err);
        var token = cryptofun.md5Crypto(email + config.session_secret);
        //发送激活邮件通知
        mail.sendActiveMail(email, token, name);

        return res.json({status: 'success', success: '欢迎来到 ' + config.sitename +
            '我们给你的注册邮箱发送了一份激活邮件，请点击其中连接以激活您的帐号。'});
    });
};

exports.postSignin = function(req, res, next) {
    var name = req.body.name;
    var pass = req.body.pass;
    if (name === '' || pass === '') {
        return res.json({status: 'fail', error: '请填写用户名和密码'});
    }
    authproxy.getUserByName(name, function(err, user) {
        if (err) return next(err);
        if (!user) {
            return res.json({status: 'fail', error: '该用户不存在！'});
        }
        pass = cryptofun.md5Crypto(pass);
        if (pass !== user.password) {
            return res.json({status: 'fail', error: '密码错误'});
        }
        //没激活  再次发送激活邮件
        if (!user.active) {
            var token = cryptofun.md5Crypto(user.email + config.session_secret);
            mail.sendActiveMail(user.email, token, user.name);
            return res.json({status: 'fail', error: '此帐号还没有激活，激活链接已发送到您的邮箱 '
                + user.email + ' 请及时查收'});
        }
        //设置cookie
        var cookieToken = cryptofun.encryt(user._id + '||' + user.name + '||'
            + user.email + '||' + user.password, config.session_secret);
        res.cookie(config.cookieName, cookieToken, {path: '/', maxAge: config.cookieAge});
        return res.json({status: 'success'});
    });
};

exports.signOut = function(req, res, next) {
    req.session.destroy();
    res.clearCookie(config.cookieName, {path: '/'});
    return res.redirect('/');
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
};

exports.showForgetPass = function(req, res, next) {
    return res.render('auth/forgetpass');
};

exports.postForgetPass = function(req, res, next) {
    var email = req.body.email;
    email = validator.trim(email);
    if (email === '') {
        return res.render('auth/forgetpass', {error: '请填写注册邮箱地址'});
    }
    if (!validator.isEmail(email)) {
        return res.render('auth/forgetpass', {error: '不正确的邮箱地址'});
    }
    authproxy.getUserByEmail(email, function(err, user) {
        if (err) return next(err);
        if (user) {
            var forgetkey = cryptofun.randomString(15);
            user.forgetkey = forgetkey;
            user.save(function(err) {
                if (err) return next(err);
            });
            //发送重置密码的邮件
            mail.sendResetPassMail(email, forgetkey, user.name);
            return res.render('notify/notify', {success: '我们给你的邮箱发送一封重置密码的邮件，请点击里面的连接以重置密码。'});
        }
    });
};

exports.showResetPass = function(req, res, next) {
    var key = req.query.key;
    var name = req.query.name;
    authproxy.getUserByName(name, function(err, user) {
        if (err) return next(err);
        if (!user) {
            return res.render('notify/notify', {error: '信息错误，无法重置密码'});
        }
        return res.render('auth/resetpass', {name: name, key: key});
    });
};

exports.postResetPass = function(req, res, next) {
    var key = req.body.key;
    var name = req.body.name;
    var pass = req.body.pass;
    var repass = req.body.repass;
    if (pass !== repass) {
        return res.render('auth/resetpass', {error: '两次密码输入不一致'});
    }
    authproxy.getUserByName(name, function(err, user) {
        if (err) return next(err);
        if (!user) {
            return res.render('auth/resetpass', {error: '信息错误，无法重置密码'});
        }
        if (user.forgetkey !== key) {
            return res.render('auth/resetpass', {error: '信息错误，无法重置密码'});
        }
        user.password = cryptofun.md5Crypto(pass);
        user.forgetkey = null;
        //既然邮箱确认，再次将active直接置为true
        user.active = true;
        user.save(function(err) {
            if (err) return next(err);
        });
        return res.render('notify/notify', {success: '重置密码成功，请重新登录'});
    });
};

exports.showProfile = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    return res.render('auth/setprofile', {config: config});
};

exports.postProfile = function(req, res, next) {

};

exports.showGravatar = function(req, res, next) {

};

exports.postGravatar = function(req, res, next) {

};

exports.showSettingResetPass = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    return res.render('auth/setresetpass');
};

exports.postSettingResetPass = function(req, res, next) {

};


exports.authUser = function(req, res, next) {
    var sess = req.session;
    if (sess && sess.user) {
        authproxy.getUserById(req.session.user._id, function(err, user) {
            if (err) return next(err);
            if (user) {
                user.format_create_time = formatfun.formatDate(user.createtime, true);
                sess.user = user;
                res.locals.c_user = user;
                return next();
            } else {
                return next();
            }
        });
    } else {
        var authcookie = req.cookies[config.cookieName];
        if (!authcookie) {
            return next();
        }
        var cookieToken = cryptofun.decryt(authcookie, config.session_secret);
        var userid = cookieToken.split('||')[0];
        authproxy.getUserById(userid, function(err, user) {
            if (err) return next(err);
            if (user) {
                user.format_create_time = formatfun.formatDate(user.createtime, true);
                sess.user = user;
                res.locals.c_user = user;
                return next();
            } else {
                return next();
            }
        });
    }
};