var LocalStrategy = require('passport-local').Strategy;
var User         = require("../models/user");
var jwt           = require('jsonwebtoken');

module.exports = function(passport) {
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {
    console.log('in passport');
    process.nextTick(function() {
      User.findOne({ 'email' : email }, function(err, user) {
          console.log('creating user in passport');
        if (err) return done(err);
        if (user) return done(null, false);

        var newUser       = new User();
        newUser.email     = email;
        newUser.name      = req.body.name;
        newUser.img      = req.body.img;
        newUser.password  = newUser.encrypt(password);

        newUser.save(function(err) {
          console.log('saving user in passport');
          if (err) return done(err);
          return done(null, newUser);
        });
      });
    });
  }));
}