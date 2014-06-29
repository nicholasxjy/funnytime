var Joke = require('../models').Joke;

exports.getJokeById = function(jokeid, callback) {
    var query = Joke.where({_id: jokeid});
    query.findOne(callback);
};

exports.createNewJoke = function(authorid, content, link, video, photos, attachtype, select, question, answer, callback) {
    var joke = new Joke();
    joke.authorid = authorid;
    joke.content = content;
    joke.link = link;
    joke.video = video;
    joke.photos = photos;
    joke.attachtype = attachtype;
    joke.question = question;
    joke.answer = answer;
    joke.save(callback);
};