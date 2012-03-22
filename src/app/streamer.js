/*!
 * zwitscher
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 * MIT Licensed
 *
 */

var Twitter = require('twitter');
module.exports = function (io, configuration) {
	
	var twitter = new Twitter({
	    consumer_key: configuration.twitter.consumer_key,
	    consumer_secret: configuration.twitter.consumer_secret,
	    access_token_key: configuration.twitter.access_token_key,
	    access_token_secret: configuration.twitter.access_token_secret
	});

	twitter.stream('user', {track:'nodejs'}, function(stream) {
	    stream.on('data', function(data) {
	        console.log(util.inspect(data));
	    });
	    // Disconnect stream after five seconds
	    setTimeout(stream.destroy, 5000);
	});

};