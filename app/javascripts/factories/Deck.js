angular.module('kuato')
.factory('Deck', ["$http", "User", function DeckFactory ($http, User) {

    return {
        all: function () {
            return $http({
                method: "GET",
                url: "/api/v1/decks"
            });
        },
        add: function (deck) {
            return $http({
                method: "POST",
                url: "/api/v1/decks",
                data: deck
            });
        }
    }
}]);