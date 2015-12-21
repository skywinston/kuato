angular.module('kuato')
.directive('kuatoDashboard', ["AuthToken", "Deck" , "$state", function (AuthToken, Deck, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/dashboard.html',
        controller: function ($scope) {
            if ( !AuthToken.getToken() ) { $state.go('login'); } // Guard clause for active user in local storage

            $scope.decks = Deck.all()
                .then( function (response) {
                    console.log(response.data);
                });

        },
        link: function (scope, elem, attrs) {
            console.log(elem);
            console.log(scope.decks); // Looking for an array of deck objects
        }
    };

}]);