var path = require('path');
var pkg = require('./package.json');

var config = {
    author: 'nicholas',
    sitename: 'LOL ME',
    description: 'We just want every day is full of smile.',
    vesion: pkg.version,

    host: 'http://127.0.0.1:1337',
    port: 1337,

    dbname: 'lolme',
    dburl: 'mongodb://127.0.0.1/lolme',
    session_secret: 'lolme',
    cookie_secret: 'lolme',
    cookieName: 'lolme',
    cookieAge: 1000*60*60*24*30,
    page_with_item: 9,
    user_page_limit: 9,
    default_gravatar_url: '/images/default.png',
    none_profile: '你还没有向大家介绍你自己呢！',

    mail_config: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'lolme_club@126.com',
            pass: 'hilarious4862'
        }
    },
    siteStaticDir: 'http://127.0.0.1:1337',
    uploadDir: path.join(__dirname, 'public', 'uploads'),
    profileImgDir: path.join(__dirname, 'public', 'gravatars'),
    location: [{key: 0, value: "其他"},{key: 1, value: "北京"},{key: 2, value: "天津"},{key: 3, value: "河北"},{key: 4, value: "山西"},{key: 5, value: "内蒙古"},{key: 6, value: "辽宁"},{key: 7, value: "吉林"},{key: 8, value:"黑龙江"},{key: 9, value: "上海"},{key: 10, value: "江苏"},{key: 11, value: "浙江"},{key: 12, value: "安徽"},{key: 13, value: "福建"},{key: 14, value: "江西"},{key: 15, value: "山东"},{key: 16, value: "河南"},{key: 17, value: "湖北"},{key: 18, value: "湖南"},{key: 19, value: "广东"},{key: 20, value: "海南"},{key: 21, value: "广西"},{key: 22, value: "甘肃"},{key: 23, value: "陕西"},{key: 24, value: "新疆"},{key: 25, value: "青海"},{key: 26, value: "宁夏"},{key: 27, value: "重庆"},{key: 28, value: "四川"},{key: 29, value: "贵州"},{key: 30, value: "云南"},{key: 31, value: "西藏"},{key: 32, value: "台湾"},{key: 33, value: "澳门"},{key: 34, value: "香港"}],
    allow_signup: true
};

module.exports = config;