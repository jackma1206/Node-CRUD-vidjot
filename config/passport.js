//define passport strategies (local/fb/twitter etc.)
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require('mongoose'); // load db
const bcrypt = require('bcryptjs'); //unhash password

//Load User model

const User = mongoose.model('users');

//define the local strategy
module.exports = function(passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {
    User.findOne({
      email: email
    }).then(user => {
      if (!user) {
        return done(null, false, {
          message: 'No User Found'
        });
      }
      //match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Password Incorrect'
          });
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

}
