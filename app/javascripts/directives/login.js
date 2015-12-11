angular.module('kuato')
.directive('kuatoLogin', ["$state", "$http", "UserFactory", function ($state, $http, UserFactory){
    return {
        restrict: "E",
        templateUrl: "templates/login.html",
        scope: {},
        controller: function($scope){
            // Maybe I'll need some controller code here...
        },
        link: function (scope, elem, attrs) {
            console.log(UserFactory);
            scope.userLogin = function(){
                UserFactory.login(scope.email, scope.password);
            }
        }
    };
}]);