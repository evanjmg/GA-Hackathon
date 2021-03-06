var User    = require('../models/user');
var jwt      = require('jsonwebtoken');
var passport = require('passport');


function signup(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send({ error: 'User already exists!' + JSON.parse(info) });

    var token = jwt.sign(user, process.env.EVENT_MATCH_JWT_SECRET, { expiresInMinutes: 1440 });

    return res.status(200).send({ 
      success: true,
      message: "There is no going back now.",
      token: token
    });
  })(req, res, next);
};

function login(req, res, next) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) return res.status(500).send(err);

    if (!user) return res.status(403).send({ message: 'You seem to be mistaken, we have no user with that identity.' });

    if (!user.validPassword(req.body.password)) return res.status(403).send({ message: 'Authentication failed. Wrong password.' });

    var token = jwt.sign(user, process.env.EVENT_MATCH_JWT_SECRET, { expiresInMinutes: 1440 });

    return res.status(200).send({
      success: true,
      message: 'You are In',
      token: token
    });
  });
};

module.exports = {
  signup: signup,
  login: login
}