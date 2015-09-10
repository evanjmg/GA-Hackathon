angular
.module("eventMatchApp")
  .controller("eventsController", EventController)

  .filter('cmdate', [
      '$filter', function($filter) {
          return function(input, format) {
              return $filter('date')(new Date(input), format);
          };
      }
  ]);

EventController.$inject = ['Event', 'CurrentUser', '$state']; 

function EventController(Event, CurrentUser, $state){
  // this.all = Event.query();

  var self = this;
  self.all = [];
  self.query = {};
  self._id = {};
  self.event = {};
  self.currentEvent = {};
  self.myEvents = {};
  // self.toggleButton();
  
  // self.toggleButton = function () {
  //   Geo.locate(function (location) {
  //     console.log(location);
  //   })
  // }
  // My Events
  self.getMyEvents = function () {
    self.currentUser = CurrentUser.check();
    Event.myEvents({ "userId": self.currentUser.id }, function (res) {
      if (!res.error) { self.myEvents = res;
        console.log(res);
      }
      $state.go('myEvents');  
    } )
  }

  // Cancel Event 
  self.cancel = function (event, $event) {
    console.log(event);
    self.currentEvent = CurrentUser.check();
    Event.inviteDelete({ "eventId": event._id, "userId": self.currentUser.id }, function (resp) {
      $($event.target).parent('.myEventsItem').slideUp();
    });

  }
  self.showEvent = function (event) {
      self.currentEvent = event;
    // Event.get({ id: "55ef307df1ada951af60e8c1" }, getEventResponse)
  }
  self.pairUp = function (event, $event) {
// user
    self.currentUser = CurrentUser.check();
    $($event.target).html('Pairing...');
    Event.findByName({ name: event.name }, function (response) {
      
      console.log('First bit',response);


      if (response._id) {

      Event.invite({ 'eventId': response._id, 'userId': self.currentUser.id }, function (resp) {
        console.log('invited', resp);
      });
      Event.pairup({'eventId': response._id, 'userId': self.currentUser.id }, function (pairResponse) {
        console.log('in pair up', pairResponse)
        if (!pairResponse.message) {
          $($event.target).html('Paired!');
          $($event.target).next(".whoIsButton").slideDown();
        } else {
          $($event.target).html('Already Paired');
        }
      });
      } else {
     Event.save(event, function (resp) {
       Event.invite({ 'eventId': resp.event._id, 'userId': self.currentUser.id }, function (resp) {
         console.log('invited', resp);
       });
       console.log('event saved', resp);
       });
     $($event.target).after('<br/><span style="padding-top:12px;">Please check my events.</span>')
       
      }
    })


  }
  self.search = function (){
    $('.loading').fadeIn();
    self.all = {};
    Event.search(self.query, searchResponse);
  }
  self.navSearch = function (){
    $state.go('search');
    self.all = {};
    $('.spinner').fadeIn();
    Event.search(self.query, searchResponse);
   
  }

  function searchResponse(response) {
    $('.loading').fadeOut();
    self.all = response;
    // moment( ).format('MMMM Do YYYY, h:mm:ss a'
   
}  

function getEventResponse(response) {
  console.log(response);
  self.event = response;
}
}