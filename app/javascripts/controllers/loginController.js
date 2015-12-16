angular.module('kuato')
.controller('loginCtrl', ["$scope", "User", function LoginController ($scope, User) {
    $scope.login = false; // leave false while testing register form, leave true when loading login by default

    $scope.email = "";
    $scope.password = "";

    $scope.userLogin = function(){
        User.login($scope.email, $scope.password);
    };

    $scope.userRegister = function (email, password) {
        console.log("Email in scope", email);
        console.log("Password in scope", password);
        User.register(email, password)
            .then(function success(response){
                var $login = $("#login__background");
                var viewportHeight = $login.height;
                $login.velocity({translateY: viewportHeight}, {complete: function () {$state.go('dashboard')};});
            });
    };

    $scope.toggleRegister = function(){
        $scope.login = !$scope.login;
    };
}]);