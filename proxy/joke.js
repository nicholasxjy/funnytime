var Joke = require('../models').Joke;

exports.getJokeById = function(jokeid, callback) {
    var query = Joke.where({_id: jokeid});
    query.findOne(callback);
};

exports.createNewJoke = function(authorid, content, link, photos, callback) {
    var joke = new Joke();
    joke.authorid = authorid;
    joke.content = content;
    joke.link = link;
    joke.photos = photos;
    joke.save(callback);
};