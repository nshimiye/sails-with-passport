/**
* @Author: mars
* @Date:   2016-12-07T14:48:16-05:00
* @Last modified by:   mars
* @Last modified time: 2016-12-07T23:41:30-05:00
*/
'use strict';

/**
 * User.js
 *
 * @description ::
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt');
module.exports = {
  attributes: {
    // start relationships
      externalServices: {
        collection: 'ExternalService',
        via: 'users',
        dominant: true
      },
    // end relationships

      email: {
          type: 'email',
          required: true,
          unique: true
      },
      password: {
          type: 'string',
          minLength: 6,
          required: true
      },
      comparePassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
      toJSON: function() {
          var obj = this.toObject();
          delete obj.password;
          return obj;
      }
  },

  beforeCreate: function(user, next) {
      if (user.hasOwnProperty('password')) {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
          next(false, user);

      } else {
          next(null, user);
      }
  },


  beforeUpdate: function(user, next) {
      if (user.hasOwnProperty('password')) {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
          next(false, user);
      } else {
          next(null, user);
      }
  },

  authenticate: function (email, password) {
      return UtilityService.Model(User).findOne({email})
      .then( user => {
        // return (user && user.date_verified && user.comparePassword(password))? user : null;
          // if(user && !user.comparePassword(password)) { return Promise.reject('wrong password'); }
          return (user && user.comparePassword(password))? user : null;
      });
    }
};
