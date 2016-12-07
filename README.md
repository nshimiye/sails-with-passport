# sails-with-passport
Integrate passport into your sailsjs application

# Scenario

# End goal

##### [Passport's methods](https://github.com/sails101/using-passport/blob/master/ORIGINAL_PREHOOK_WALKTHROUGH.md#passports-methods)

 Method                                         | What it does
 ---------------------------------------------- | ------------------------------------------------------------------------------------------------
 `req.authenticate(strgy,cb)(req,res,mysteryFn)`| Parses credentials from the session.  If you're not logged in, it parses credentials from the request, then calls the `verify()` fn you set up when configuring the strategy.  Finally it calls its callback (`cb`).
 `req.login()`                                  | Calls the `seralizeUser()` fn you set up when configuring passport and stuffs the user in the session.
 `req.logout()`                                 | Calls the `deseralizeUser()` fn you set up when configuring passport and rips the user out of the session.
 `req.logout()`                                 | Calls the `deseralizeUser()` fn you set up when configuring passport.


# Step by step

* Create a new app
```sh
sails new sails-with-passport
# change templating engine to handlebars => https://github.com/nshimiye/sailsjs-handlebars-app/blob/master/README.md
```

* Install passport related packages
```sh
npm install passport passport-local --save
```

* Create passport hook and add initialization logic
```javascript
// api/hooks/passport/index.js

```

* Create the user model
```javascript
// api/models/User.js
```

* Create UserController and add required logic to register and login user
```javascript
// api/controllers/UserController.js
```

* Create authentication policy
```javascript
// here we check for valid user session
// api/policies/isAuthenticated.js
...
  if (req.user) { return next(); }
  return res.unauthorized();
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
// views/user/login.handlebars
```

