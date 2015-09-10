angular
  .module("eventMatchApp")
  .controller("usersController", UserController);

  UserController.$inject = ['User', 'CurrentUser', '$state', '$window']  
  function UserController(User, CurrentUser, $state, $window){
    var self = this;

    self.formModel = {};
    self.submitting = false;
    self.submitted = false;
    self.has_error = false;
    
    init();

    function init() {
      self.currentUser = CurrentUser.check()
      self.all = [];
      self.user = {};
    }


    self.login = function () {
      User.login(self.user, login);
    }
    function login(response) {
      self.currentUser = CurrentUser.login(response.token);
      $window.location.reload();
      $state.go('search');
      
      init()
    }
    
    self.signup = function () {
      console.log('in self.signup');
      self.submitting = true;
      console.log(self.user)
      User.signup(self.user, login, function (){
          console.log(":)");
          self.submitting = false;
          self.submitted = true;
          self.has_error = false;
        // }).error(function(data) {
        //   console.log(":(");
        //   self.submitting = false;
        //   self.submitted = false;
        //   self.has_error = true;
        // });
      });
    }
    
    self.logout = function () {
      self.currentUser = CurrentUser.logout();
      init()
    } 

    return self; 
}  