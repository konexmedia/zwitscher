/*!
 * zwitscher
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 * MIT Licensed
 *
 */
var express = require('express'),
    io      = require('socket.io');

module.exports = function (configuration) {

    // Creating the Express.js application context.
    var app = module.exports = express.createServer();

    io = io.listen(app);

    // Application context configuration.
    app.configure(function () {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');

        app.use(express.bodyParser());
        app.use(express.methodOverride());

        app.use(express.static(__dirname + '/public'));
        app.use(app.router);
    });

    // The development environment
    // ---------------------------

    // If you would like to start the application in a development environment
    // you don't have to do anything because this is the default environment.
    // Anyway, you have the possibility to the it explicit via: $ NODE_ENV=development node app.js
    app.configure('development', function () {
        app.use(express.errorHandler({
            dumpExceptions:true,
            showStack:true
        }));
    });

    // The production environment
    // ---------------------------

    // If you would like to start the application in a production environment
    // you have to set the NODE_ENV environment variable before starting the node
    // process: $ NODE_ENV=production node app.js
    app.configure('production', function () {
        app.use(express.errorHandler());
    });

    // ### DOCME
    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/public/index.html');
    });

    // Init the streamer
    require('./streamer')(io, configuration);

    // Port setup.
    // Note that the "process.env.PORT" environment variable will
    // be configured by the hosting platform.
    var port = process.env.PORT || configuration.environment.port;

    // Starting the application.
    app.listen(port);

    console.log(configuration.meta.application.name + ' server listening on port %d in %s mode', app.address().port, app.settings.env);
};