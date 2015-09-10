angular
  .module('eventMatchApp')
  .service('TokenService', TokenService)

TokenService.$inject = ['$window', 'jwtHelper'] 
function TokenService($window, jwtHelper) {

  var self = this;

  self.parseJwt = function() {
    var token = self.getToken();
    return jwtHelper.decodeToken(token);
  }


} 