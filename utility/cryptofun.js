var crypto = require('crypto');


exports.md5Crypto = function(str) {
    var md5Hash = crypto.createHash('md5');
    md5Hash.update(str);
    str = md5Hash.digest('hex');
    return str;
};

exports.encryt = function(str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var encstr = cipher.update(str, 'utf8', 'hex');
    encstr += cipher.final('hex');
    return encstr;
};

exports.decryt = function(str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var destr = decipher.update(str, 'hex', 'utf8');
    destr += decipher.final('utf8');
    return destr;
};

exports.randomString = function(size) {
    size = size || 6;
    var allString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxLen = allString.length + 1;
    var random = '';
    while(size > 0) {
        random += allString.charAt(Math.floor(Math.random() * maxLen));
        size--;
    }
    return random;
}