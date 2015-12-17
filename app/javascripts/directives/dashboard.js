angular.module('kuato')
.directive('kuatoDashboard', ["AuthToken", "$state", function (AuthToken, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/dashboard.html',
        // todo — right now this templateUrl is not resolving properly
        controller: function ($scope) {
            // todo — see if we can inspect this directive and see the $scope.test value
            $scope.test = true;
            console.log("in the dashboard directive's built-in controller!");
            // Do some cool stuff with the view maybe...
        },
        link: function (scope, elem, attrs) {
            if ( !AuthToken.getToken() ) {
                $state.go('login');
            }
            console.log("You're in the DashBoard link function!");
        },
    };

}]);