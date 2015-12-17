angular.module('kuato')
.directive('kuatoDashboard', ["AuthToken", "$state", function (AuthToken, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/dashboard.html',
        controller: function ($scope) {

            $scope.logText = function () {
                alert($scope.text);
            };

        },
        link: function (scope, elem, attrs) {
            console.log(elem);
            // Check for token and if none is found, load the login state
            if ( !AuthToken.getToken() ) {
                $state.go('login');
            }

        }
    };

}]);