angular.module('kuato')
.directive('appnav', ["AuthToken", "User", "$state", function (AuthToken, User, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/appnav.html',
        controller: function ($scope) {
            if (!AuthToken.getToken()) { $state.go('login'); }

            $scope.test = true;

            $scope.logout = function(){
                User.logout();
                $state.go('login');
            }

        },
        link: function (scope, element, attrs) {
            console.log(element);
            element.ready(console.log("appnav component loaded..."));
        }
    };

}]);

