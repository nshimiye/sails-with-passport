/**
* @Author: mars
* @Date:   2016-12-07T15:08:25-05:00
* @Last modified by:   mars
* @Last modified time: 2016-12-07T23:43:53-05:00
*/
'use strict';


const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

const userModelIdentity = 'user';


// Teach our Passport how to serialize/dehydrate a user object into an id
passport.serializeUser(function(user, done) {
  let UserModel = sails.models[userModelIdentity];
  console.log('Using primary key', UserModel.primaryKey, 'with record:', user);
  done(null, user[UserModel.primaryKey]);
});

// Teach our Passport how to deserialize/hydrate an id back into a user object
passport.deserializeUser(function(id, done) {
  let UserModel = sails.models[userModelIdentity];
  UserModel.findOne(id, function(err, user) {
    done(err, user);
  });
});


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

         //Validate the user
         User.authenticate(email, password).then( user => {
           if (!user) { return done(null, false, { message: 'No user found.' }); }

             return done(null, user, {
               message: 'Logged In Successfully'
             });

         })
         .catch(e => done(null, false, { message:  e.message || 'Oops! Wrong password.' }));



       }
     ));


module.exports.passport = passport;
