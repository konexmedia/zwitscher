/*!
 * zwitscher
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 * MIT Licensed
 *
 */
require([
	'vendor/libraries'
],
function () {

    var helpers = {
            rearrange : function () {
                var tweets = $('#tweets p');
                var width = tweets.outerWidth();

                tweets.each(function(){
                    var className = 'sliced';
                    var node = $(this);

                    if (!node.hasClass(className)) {
                        node.addClass(className).splitLines({width:width});
                    }
                });
            }
        },
        nodes = {
            tweetList: $('#tweets')
        },
        socket = io.connect(),
        templates = {
            tweet: template = _.template($("#tweet").html())
        };

    socket.on('timeline', function (tweets) {
        _.each(tweets, function (tweet) {
            tweet = $(templates.tweet(tweet));
            nodes.tweetList.append(tweet);

            tweet.fadeIn(1000);
        });

        helpers.rearrange();
    });

    socket.on('new', function (tweet) {
        tweet = $(templates.tweet(tweet));

        nodes.tweetList.prepend(tweet);

        tweet.slideDown(2000);

        helpers.rearrange();
    });

    socket.on('delete', function (tweet) {
        tweet = $('#t' + tweet.id);

        tweet.slideUp(2000, function () {
            tweet.remove();
        });

        helpers.rearrange();
    });
});