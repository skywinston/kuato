angular.module('kuato')
.directive('appnav', ["AuthToken", function (AuthToken) {
    return {
        restrict: "E",
        templateUrl: './templates/appnav.html',
        controller: function ($scope) {
            if (!AuthToken.getToken()) { $state.go('login'); }

            $scope.test = true;

        },
        link: function (scope, element, attrs) {
            console.log(element);
            element.ready(console.log("appnav component loaded..."));
        }
    };

}]);

