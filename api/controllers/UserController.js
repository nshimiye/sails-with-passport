/**
* @Author: mars
* @Date:   2016-12-07T14:48:16-05:00
* @Last modified by:   mars
* @Last modified time: 2016-12-07T23:48:49-05:00
*/
'use strict';

/**
 * UserController
 *
 * @description ::
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 // var passport = require('passport');
 var passport = sails.config.passport;
module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
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
  login(req, res) {

    return res.login({
      successRedirect: '/'
    });
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

    sails.log.warn('---------------------------------------');
    sails.log.warn(req.query, req.body, Object.keys(passport), passport._strategies );
    sails.log.warn('---------------------------------------');

    passport.authenticate('local-signup', function(err, user, info) {
        if ((err) || (!user)) {
          return res.badRequest(info && info.message || 'Wrong Signup information');
        }
        req.logIn(user, function(err) {

            if (err) { return res.badRequest(err && err.message || 'Invalid username/password combination.'); }
            // if (err) { return res.negotiate(err); } // @TODO what does negotiate do

            // return res.send({
            //     message: info.message,
            //     user: user
            // });

            return res.redirect('/welcome');
        });

    })(req, res, next);


  }
};
