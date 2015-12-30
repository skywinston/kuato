angular.module('kuato')
.directive('kuatoDashboard', ["AuthToken", "Deck" , "$state", function (AuthToken, Deck, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/dashboard.html',
        controller: function ($scope) {
            if ( !AuthToken.getToken() ) { $state.go('login'); } // Guard clause for active user in local storage

            Deck.all()
                .then(function (response) {
                    $scope.decks = response.data;
                });

        },
        link: function (scope, element, attrs) {

        }
    };

}]);