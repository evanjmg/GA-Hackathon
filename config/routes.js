  var express = require('express');
  var router = express.Router();
   var  bodyParser = require('body-parser'); //parses information from POST
   var methodOverride = require('method-override'); 
   var expressJWT = require("express-jwt");
   var EventsController = require('../controllers/events');
   var UsersController = require('../controllers/users');
   var AuthenticationController = require('../controllers/auth');
   var SearchController = require('../controllers/search');

// AUTH
   router.route('login/')
   .post(AuthenticationController.login);
   
   router.route('join/')
   .post(AuthenticationController.signup);
   
// USERS
   router.route('/users/')
   .post(UsersController.createUsers)
   .get(UsersController.indexUsers);

// SEARCH EVENTS
router.route('/events/search')
  .get(SearchController.postEventbriteSearch)
// EVENTS
 router.route('/events/')
   .post(eventsController.eventsCreate)
   .get(eventsController.eventsIndex);

 router.route('/events/current')
     .get(eventsController.eventsCurrent); 

 router.route('/events/:id')
   .put(eventsController.eventsUpdate) 
   .delete(eventsController.eventsDelete) 
   .get(eventsController.eventsShow);

 // INVITES controller
 router.route('/invites/')
   .get(invitesController.invitesIndex)
   .post(nvitesController.invitesCreate)
   .delete(invitesController.invitesDelete);

 router.route('/invites/pending')
   .get(invitesController.invitesPending);

 router.route('/invites/accept')
   .post(invitesController.invitesAccept)



    module.exports = router;