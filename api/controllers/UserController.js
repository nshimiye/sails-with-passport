/**
* @Author: mars
* @Date:   2016-12-07T14:48:16-05:00
* @Last modified by:   mars
* @Last modified time: 2016-12-08T17:09:51-05:00
*/
'use strict';

/**
 * UserController
 *
 * @description ::
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
// const passport = require('passport');
module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: true
  },

  // protected
  welcome(req, res) {
    res.view();
  },
  loginView(req, res) {
    res.view('user/login');
  },
  signupView(req, res) {
    res.view('user/signup');
  },
	/**
   * `UserController.login()`
   */
  login(req, res, next) {

    // return res.login({
    //   successRedirect: '/'
    // });

    sails.passport.authenticate('local-signin', function(err, user, info){
      // console.log('req.user:',req.user);
      console.log('user from call to authenticate:', err, user, info);
      if (err) { return res.negotiate(err); }
      if (!user) { return res.badRequest(info && info.message || 'Invalid username/password combination.'); }

      // Passport attaches the `req.login` function to the HTTP IncomingRequest prototype.
      // Unfortunately, because of how it's attached to req, it can be confusing or even
      // problematic. I'm naming it explicitly and reiterating what it does here so I don't
      // forget.
      //
      // Just to be crystal clear about what's going on, all this method does is call the
      // "serialize"/persistence logic we defined in "serializeUser" to stick the user in
      // the session store. You could do exactly the same thing yourself, e.g.:
      // `User.req.session.me = user;`
      return req.logIn(user, function (err) {
        if (err) { return res.negotiate(err); }
        return res.redirect('/');
      });

    })(req, res, next);


  },

  /**
   * `UserController.logout()`
   */
  logout(req, res) {
    req.logout();
    return res.ok('Logged out successfully.');
  },


  /**
   * `UserController.signup()`
   */
  signup(req, res, next) {
    sails.passport.authenticate('local-signup', function(err, user, info) {
        if (err || !user) {
          return res.badRequest(info && info.message || 'Wrong Signup information');
        }
        req.logIn(user, function(err) {
            if (err) { return res.badRequest(err && err.message || 'Invalid username/password combination.'); }
            return res.redirect('/welcome');
        });
    })(req, res, next);
  }

};
