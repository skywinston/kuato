angular.module('kuato')
.directive('kuatoLogin', ["$state", "$http", "User", function ($state, $http, User){
    return {
        restrict: "E",
        templateUrl: "templates/login.html",
        scope: {},
        controller: function($scope){
            $scope.email = '';
            $scope.password = '';
        },
        link: function (scope, element) {

            scope.login = true;

            scope.userLogin = function(){
                User.login(scope.email, scope.password);
            }

            scope.userRegistration = function(){
                User.register(scope.email, scope.password);
            }

            scope.toggleRegister = function(){
                scope.login = !scope.login;
            }

        }
    };
}]);