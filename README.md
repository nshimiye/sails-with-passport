<!--
@Author: mars
@Date:   2016-12-07T14:19:33-05:00
@Last modified by:   mars
@Last modified time: 2016-12-09T12:13:57-05:00
-->



# sails-with-passport
Integrate passport into your sailsjs application

# Scenario
I want to signup, login, and logout out of a sailsjs app.

# End goal
<!-- should be a screenshot i guess -->


# Step by step

* Create a new app
```sh
sails new sails-with-passport
# change templating engine to handlebars => https://github.com/nshimiye/sailsjs-handlebars-app/blob/master/README.md
```

* Install passport related packages
```sh
npm install bcrypt passport passport-local --save
```

* Create passport hook and add initialization logic
```javascript
// api/hooks/passport/index.js
...
let UserModel = sails.models[sails.config.passport.userModelIdentity];
passport.serializeUser((user, done) => {
  done(null, user[UserModel.primaryKey]);
});

passport.deserializeUser((id, done) => {
  UserModel.findOne(id, (err, user) => {
    done(err, user);
  });
});

PassportService.localInitialization(passport, LocalStrategy, sails);
// here we create a pointer to the passport instance,
// and use it throughout the entire app as [sails.passport] @TODO is this necessary?
sails.passport = passport;
...
```
[code for PassportService.localInitialization]()

* Configure passport settings
```javascript
// config/passport.js
module.exports = {
  passport: {
    userModelIdentity: 'user'
  }
};
```

* Create the user model and UserController
```sh
# api/models/User.js
# api/controllers/UserController.js
sails generate controller user login logout signup
sails generate model user email password
```

* Add code to encrypt the password
```javascript
// api/models/User.js
...
beforeCreate: function(user, next) {
    if (user.hasOwnProperty('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      next(false, user);
    } else {
        next(null, user);
    }
},
...
```
[complete code for User model]()

* Add required logic to manage users
```javascript
// api/controllers/UserController.js
// sample for how signup is done
...
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
...
```

* Create authentication policies
```javascript
// here we check for valid user session
// api/policies/isAuthenticated.js
...
if (req.isAuthenticated()) { return next(); }
return res.redirect('/login');
...
```
```javascript
// For login and signup routes, we only allow access if session does not exist
// api/policies/isOnlyPublic.js
...
if (!req.isAuthenticated()) { return next(); }
return res.redirect('/');
...
```

* Configure policy settings for UserController
```javascript
// config/policies.js
// everything is private except UserController.login and UserController.signup
...
  UserController: {
    '*': 'isAuthenticated',
    login: true,
    signup: true
  }
...
```

* Create all required views (in handlebars)
```javascript
// views/homepage.handlebars
// views/user/signup.handlebars
// views/user/login.handlebars
// views/user/welcome.handlebars
```

* Add required routes
```javascript
// config/routes.js
...
'get /login': {
  controller: 'UserController',
  action: 'loginView'
},
'get /signup': {
  controller: 'UserController',
  action: 'signupView'
},
'post /login': 'UserController.login',
'post /signup': 'UserController.signup',
...
```

* Testing
  * Run the app `sails lift`
  * open url [http://localhost:1337/](http://localhost:1337/) in the browser
  * click signup link [http://localhost:1337/](http://localhost:1337/)
  * input email and password, then hit submit
  * There you are!!
  * Now you can access the logged in user info by calling `req.user`.
  * Moreover, the `req.session` has a passport object in it `req.session.passport`.

# Resource
[How do I use Passport with my Sails app?](https://github.com/sails101/using-passport)
[Implement Passport.js authentication with Sails.js ~0.10](http://iliketomatoes.com/implement-passport-js-authentication-with-sails-js-0-10-2/)
