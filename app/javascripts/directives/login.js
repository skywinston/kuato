angular.module('kuato')
.directive('kuatoLogin', ["$state", function ($state){
    return {
        restrict: "E",
        templateUrl: "templates/login.html",
        scope: {},
        controller: function($scope){
            $scope.test = true;
        },
        link: function (scope, elem, attrs) {
            console.log("You're in the Login directive!");
        }
    }
}])