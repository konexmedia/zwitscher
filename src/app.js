/*!
 * zwitscher
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 * MIT Licensed
 *
 */

// Bootstrapping
// -------------

// Dependencies
var Settings = require('settings');

// Some meta data
var meta = {
    application:{
        name:'zwitscher',
        version:'0.1.0',
        authors:[
            {name:'André König', email:'andre.koenig@konexmedia.com'}
        ]
    }
};

// Loading the application configuration
try {
    var configuration = {
        meta: meta,
        environment: new Settings(__dirname + '/config/environment.js').getEnvironment().environment,
        twitter: new Settings(__dirname + '/config/twitter.js').getEnvironment().twitter
    };
} catch (e) {
    console.error("[ERROR] Application is not configured. Verify your config directory.");
    return;
}

// Booting the application
require('./app/')(configuration);