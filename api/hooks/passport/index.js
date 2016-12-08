/**
* source: https://github.com/sails101/using-passport/blob/master/api/hooks/passport/index.js
* @Author: mars
* @Date:   2016-12-08T00:32:34-05:00
* @Last modified by:   mars
* @Last modified time: 2016-12-08T16:29:38-05:00
*/
'use strict';

/**
* Module dependencies
*/
const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

/**
* Passport  hook
*/
module.exports = function (sails){

  return {

    defaults: {
      passport: {
        // Default to look for a model w/ identity 'user'
        userModelIdentity: 'user'
      }
    },

    initialize: function (cb) {
      var err;

      // Validate `userModelIdentity` config
      if (typeof sails.config.passport.userModelIdentity !== 'string') {
        sails.config.passport.userModelIdentity = 'user';
      }
      sails.config.passport.userModelIdentity = sails.config.passport.userModelIdentity.toLowerCase();

      // We must wait for the `orm` hook before acquiring our user model from `sails.models`
      // because it might not be ready yet.
      if (!sails.hooks.orm) {
        err = new Error();
        err.code = 'E_HOOK_INITIALIZE';
        err.name = 'Passport Hook Error';
        err.message = 'The "passport" hook depends on the "orm" hook- cannot load the "passport" hook without it!';
        return cb(err);
      }
      sails.after('hook:orm:loaded', function (){

        // Look up configured user model
        var UserModel = sails.models[sails.config.passport.userModelIdentity];

        if (!UserModel) {
          err = new Error();
          err.code = 'E_HOOK_INITIALIZE';
          err.name = 'Passport Hook Error';
          err.message = 'Could not load the passport hook because `sails.config.passport.userModelIdentity` refers to an unknown model: "'+sails.config.passport.userModelIdentity+'".';
          if (sails.config.passport.userModelIdentity === 'user') {
            err.message += '\nThis option defaults to `user` if unspecified or invalid- maybe you need to set or correct it?';
          }
          return cb(err);
        }

        // Teach our Passport how to serialize/dehydrate a user object into an id
        passport.serializeUser((user, done) => {
          done(null, user[UserModel.primaryKey]);
        });

        // Teach our Passport how to deserialize/hydrate an id back into a user object
        passport.deserializeUser((id, done) => {
          UserModel.findOne(id, (err, user) => {
            done(err, user);
          });
        });

        PassportService.localInitialization(passport, LocalStrategy, sails);

        // @TODO do a research on proper usage of "require"
        sails.passport = passport;

        // It's very important to trigger this callback method when you are finished
        // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
        cb();

      });

    },

    routes: {
      before: {
        '/*': function configurePassport(req, res, next) {
          sails.log.warn('------- START --------');
          sails.log.warn(req.query, req.body, req.user, req.session);
          sails.log.warn('------- END --------');

          sails.passport.initialize()(req, res, err => {
            if (err) { return res.negotiate(err); }
            sails.passport.session()(req, res, err => {
              if (err) { return res.negotiate(err); }
              next();
            });
          });

        }
      }
    }
  };
};
