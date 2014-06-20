var path = require('path');
var pkg = require('./package.json');

var config = {
    author: 'nicholas',
    sitename: 'LOL ME',
    description: 'We just want every day is full of smile.',
    vesion: pkg.version,

    host: 'http://127.0.0.1:3000',
    port: 3000,

    dbname: 'lolme',
    dburl: 'mongodb://127.0.0.1/lolme',
    session_secret: 'lolme',
    cookie_secret: 'lolme',
    cookieName: 'lolme',
    cookieAge: 1000*60*60*24*30,
    page_with_item: 10,

    default_gravatar_url: '',
    none_profile: '你还没有向大家介绍你自己呢！',

    mail_config: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'jokeofday@126.com',
            pass: 'hilarious4862'
        }
    },
    siteStaticDir: 'http://127.0.0.1:3000',
    uploadDir: path.join(__dirname, 'public', 'uploads'),
    profileImgDir: path.join(__dirname, 'public', 'gravatars'),

    allow_signup: true
};

module.exports = config;