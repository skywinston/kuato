angular.module('kuato')
.factory('Deck', ["$http", function DeckFactory ($http) {
    return {
        all: function () {
            return $http({
                method: "GET",
                url: "/api/v1/decks",
            });
        }
    }
}]);