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
    var cipher = crypto.createDecipher('aes192', secret);
    var destr = cipher.update(str, 'hex', 'utf8');
    destr += cipher.final('utf8');
    return destr;
};