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
                Choreographer.revealApp($login);

            }, function rejected(response){

                console.log("Error logging in: ", response.data);

            });
    };

    $scope.userRegister = function (email, password) {
        User.register(email, password)
            .then(function success(response){
                console.log("User successfully registered!");

                $login = $(".login__background");
                Choreographer.revealApp($login);
            });
    };

    $scope.toggleRegister = function(){
        $scope.login = !$scope.login;
    };
}]);