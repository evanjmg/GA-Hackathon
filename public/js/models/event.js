angular
 .module('eventMatchApp')
 .factory('Event', Event);

 Event.$inject = ['$resource'];
 function Event ($resource) {

  var url = 'https://eventmatch.herokuapp.com/api/events/'
  var EventResource = $resource(url + ':id', {id: '@_id'}, {
    'update': { method: 'PUT' },
    'search': { method: 'POST', url: url + 'search', isArray:true },
    'invite': { method: 'POST', url: 'https://eventmatch.herokuapp.com/api/invites/' },
    'pairup': { method: 'POST', url: 'https://eventmatch.herokuapp.com/api/pairup'},
    'myEvents': { method: 'POST', url: url + 'attending', isArray:true},
    'findByName': { method: 'POST', url: url + 'search/name'},
    'inviteDelete': { method: 'POST', url: 'https://eventmatch.herokuapp.com/api/invites/delete' }
  });

  
  return EventResource; 
 }

 // var EventResource = $resource('http://172.19.5.100:9000/api/events/search', {id: '@_id'}, {
 //   'update': { method: 'PUT' }

 // });