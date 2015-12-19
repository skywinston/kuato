angular.module('kuato')
.directive('kuatoDashboard', ["AuthToken", "Deck" , "$state", function (AuthToken, Deck, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/dashboard.html',
        controller: function ($scope) {
            if ( !AuthToken.getToken() ) { $state.go('login'); } // Guard clause for active user in local storage

            $scope.decks = Deck.all(); // Fetch all decks from the db

        },
        link: function (scope, elem, attrs) {
            console.log(elem);
        }
    };

}]);