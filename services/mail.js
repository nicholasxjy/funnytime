var nodemailer = require('nodemailer');
var util = require('util');
var config = require('../config');
var smtpTransport = nodemailer.createTransport('SMTP', config.mail_config);

exports.sendActiveMail = function(useremail, token, name) {
    var from = util.format('%s <%s>', config.sitename, config.mail_config.auth.user);
    var to = useremail;
    var subject = config.sitename + ' 帐号激活。';
    var content = "<p>您好，</p>" + "<p>感谢注册 " + config.sitename + ", 请点击下面链接以激活账户</p>" +
        "<a href='" + config.host +"/active_account?key="+ token + "&name="+ name +"'>激活链接</a>"
        +"<p>再次欢迎您的到来，Having fun here!</p>";

    smtpTransport.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: content
    }, function(err, res) {
        if (err) console.log('Send Email error: ' + err.message);
    });
};

exports.sendResetPassMail = function(useremail, key, name) {
    var from = util.format('%s <%s>', config.sitename, config.mail_config.auth.user);
    var to = useremail;
    var subject = config.sitename + ' 重置密码。';
    var content = "<p>您好，</p>" + "<p>请在24小时内点击下面的链接，来重置您的密码。</p>" +
        "<a href='" + config.host +"/reset-pass?key="+ key +"&name="+ name +"'>重置密码链接</a>";
    smtpTransport.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: content
    }, function(err, res) {
        if (err) console.log('Send Reset Pass Email error: ' + err.message);
    });
}