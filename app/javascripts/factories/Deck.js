angular.module('kuato')
.factory('Deck', ["$http", "User", function DeckFactory ($http, User) {

    return {

        index: {},

        fetch: function () {
            return $http({
                method: "GET",
                url: "/api/v1/decks"
            }).then(function(response){
                this.index = response.data;
                return response;
            }.bind(this));
        },

        getCardsForDeck: function (id) {
            return $http({
                method: "GET",
                url: "/api/v1/decks/" + id + ""
            });
        },

        create: function (deckTitle) {
            return $http({
                method: "POST",
                url: "/api/v1/decks",
                contentType: "application/json",
                data: {title: deckTitle}
            }).then(function (response) {
                this.index.push(response.data);
                return response;
            }.bind(this));
        },

        getOne: function (deckId) {
            return $http({
                method: "GET",
                url: "/api/v1/decks/deck/" + deckId
            });
        }

    }
}]);