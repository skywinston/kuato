angular.module('kuato')
.controller('loginCtrl', [
    "$scope",
    "User",
    "$state",
    "Choreographer",
    function LoginController ($scope, User, $state, Choreographer) {
    $scope.login = true;

    $scope.email = "";
    $scope.password = "";

    $scope.userLogin = function(email, password){
        User.login(email, password)
            .then(function success(response){
                console.log("User successfully logged in!");

                $login = $(".login__background");
                Choreographer.revealDashBoard($login);
            });
    };

    $scope.userRegister = function (email, password) {
        User.register(email, password)
            .then(function success(response){
                console.log("User successfully registered!");

                $login = $(".login__background");
                Choreographer.revealDashBoard($login);
            });
    };

    $scope.toggleRegister = function(){
        $scope.login = !$scope.login;
    };
}]);