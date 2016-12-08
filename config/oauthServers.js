/**
* @Author: mars
* @Date:   2016-12-07T23:08:37-05:00
* @Last modified by:   mars
* @Last modified time: 2016-12-07T23:33:04-05:00
*/

// config/externalServices.js

// expose our config directly to our application using module.exports
let oauthServers = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};

module.exports.oauthServers = oauthServers;
