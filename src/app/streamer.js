/*!
 * zwitscher
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 * MIT Licensed
 *
 */
var Twitter    = require('twitter'),
	moment     = require('moment'),
    underscore = require('underscore');

module.exports = function (io, configuration) {

	var tweetCache = {
			items: [],
			blocked: false
		},
	    twitter = new Twitter({
	        consumer_key: configuration.twitter.consumer_key,
	    	consumer_secret: configuration.twitter.consumer_secret,
	    	access_token_key: configuration.twitter.access_token_key,
	    	access_token_secret: configuration.twitter.access_token_secret
		}),
		helpers = {
			slice : function (tweet) {
				return {
					id: tweet.id_str,
					text: tweet.text,
					created: moment(tweet.created_at).fromNow(),
					user: tweet.user.screen_name
				}
			}
		},
		user;

	// Clear the tweets cache.
	setInterval(function () {
		if (!tweetCache.blocked) {
			tweetCache.items = [];
		}
	}, configuration.twitter.cachetimeout);

	io.sockets.on('connection', function (socket) {
		// Get the latest 20 tweets and send them to the client.
		if (tweetCache.items.length === 0) {
			tweetCache.blocked = true;

			twitter
				.verifyCredentials(function (data) {
					user = data.screen_name;
				})
			    .getUserTimeline(function (tweets) {
					underscore.each(tweets, function (tweet) {
						tweet = helpers.slice(tweet);

						if (user === tweet.user) {
							tweetCache.items.push(tweet);
						}
					});

					socket.emit('timeline', tweetCache.items);

					tweetCache.blocked = false;
				});
		} else {
			socket.emit('timeline', tweetCache.items);
		}
	});

	twitter.stream('user', function(stream) {
	    stream.on('data', function(data) {
	    	var tweet = {}
	    	  , event;

	    	// A new tweet
	    	if (data.text) {
	    		tweet = helpers.slice(data);

	    		if (tweet.user === user) {
	    			event = 'new';

	    			tweetCache.items.push(tweet);
	    		}

	    	// A is not available anymore.
	    	} else if (data.delete) {
	    		event = 'delete';

	    		tweet.id = data.delete.status.id_str;
	    	}

	    	if (event) {
	        	io.sockets.emit(event, tweet);
	        }
	    });
	});
};