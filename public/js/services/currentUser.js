angular
  .module('eventMatchApp')
  .factory('CurrentUser', CurrentUser);

  CurrentUser.$inject = ['$window', 'jwtHelper'];

  function CurrentUser($window, jwtHelper) {
    function login(token) {

      var user = jwtHelper.decodeToken(token);
      console.log(user,token);
      if (user) {
        $window.localStorage.setItem('token', token);
        return user;
      } else {
        return false
      }
    }
    function check() {
      var token = $window.localStorage.getItem('token');
      if (token) return login(token)
    }
  function logout() {
    $window.localStorage.removeItem('token');
  }
  return {
    check: check,
    login: login,
    logout: logout
  }
}