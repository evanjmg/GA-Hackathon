var express = require('express');
var router = express.Router()
var passport   = require("passport");
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var expressJWT = require("express-jwt");
// Setup Passport
require('./config/passport')(passport);


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/event-match');

var routes = require('./config/routes');

app
  .use('/api', expressJWT({secret: config.secret})
  .unless({path: ['/api/authorize', '/api/join'], method: 'post'}));

// Handle "No authorization token was found" errors
app.use(function (error, request, response, next) {
  if (error.name === 'UnauthorizedError') {
    response.status(401).json({message: 'You need an authorization token to view confidential information.'});
  }
});

app.use(passport.initialize());
// Setup CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});


app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(routes);


app.listen(9000, function () {
  console.log( "Express server listening on port " + port);
});