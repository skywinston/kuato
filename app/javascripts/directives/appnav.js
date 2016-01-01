angular.module('kuato')
.directive('appnav', ["AuthToken", "User", "$state", function (AuthToken, User, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/appnav.html',
        controller: function ($scope) {
            if (!AuthToken.getToken()) { $state.go('login'); }

            $scope.logout = function(){
                User.logout();
                $state.go('login');
            }

        },
        link: function (scope, element, attrs) {
            // todo — what is the viability of using global state object to ng-if elems out based on viewport width?
        }
    };

}]);

