/**
* @Author: mars
* @Date:   2016-12-08T00:26:07-05:00
* @Last modified by:   mars
* @Last modified time: 2016-12-08T16:24:16-05:00
*/
'use strict';

module.exports = {
  /**
   * here we setup local authentication using LocalStrategy
   * @NOTE there is not processing going on here, we just setup
   *       passport so that we will be able to use it during signup and signin
   *       inside authentication Controllers
   * @param passport { Passport }
   * @param LocalStrategy { LocalStrategy }
   * @param sails { Sailsjs Instance }
   */
  localInitialization(passport, LocalStrategy, sails) {

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : false // allows us to pass back the entire request to the callback
    },
    function(email, password, done) {

      sails.log.warn('---------------------------------------');
      sails.log.warn(email, password, typeof(done));
      sails.log.warn('---------------------------------------');

      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        // save new user
        UtilityService.Model(User).create({
          email,
          password
        }).then(newUser => {
          return done(null, newUser);
        })
        .catch(e => done(null, false, { message: e && e.message || 'No user found.' }));

      });
    }));


    // =========================================================================
    // LOCAL SIGNIN ============================================================
    // =========================================================================
    // @TODO put this in the congif folder and add more Strategies
    passport.use('local-signin', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback : false // allows us to pass back the entire request to the callback
    },
    function(email, password, done) {
      sails.log.debug('--------------- START localInitialization------------------------');
      sails.log.debug(email, password);
      sails.log.debug('---------------END localInitialization----------------------');

      // avoid possibility of passport saying that it is not initialized
      process.nextTick(function() {

        //Validate the user
        User.authenticate(email, password).then( user => {
          if (!user) { return done(null, false, { message: 'No user found.' }); }

          return done(null, user, {
            message: 'Logged In Successfully'
          });

        })
        .catch(e => done(null, false, { message:  e.message || 'Oops! Wrong password.' }));

      });

    }));

  }

};
