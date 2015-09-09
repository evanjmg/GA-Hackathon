var express = require('express');
var expressJWT = require("express-jwt");
var bodyParser = require('body-parser');
var logger = require('morgan');
var router = express.Router()
var passport   = require("passport");
var path = require('path');
var app = express();
var morgan = require('morgan')



// Setup Passport
require('./config/passport')(passport);


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/event-match');




app
  .use('/api', expressJWT({secret: process.env.EVENT_MATCH_JWT_SECRET})
  .unless({path: ['/api/login', '/api/join'], method: 'post'}));

// Handle "No authorization token was found" errors
app.use(function (error, request, response, next) {
  if (error.name === 'UnauthorizedError') {
    response.status(401).json({message: 'You need an authorization token to view confidential information.'});
  } else {
    next()
  }
});
// Setup Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));



app.use(passport.initialize());
// Setup CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});


app.use(passport.initialize());

var routes = require('./config/routes');

app.use('/api', routes);

app.listen(9000, function () {
  console.log( "Express server listening on port " + 9000);
});