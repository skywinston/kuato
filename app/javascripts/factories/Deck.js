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
                console.log("what does a new deck look like?");
                console.log(response);
                // bind the new deck object to the deck index.
                this.index[response.data.id] = response.data;
                return response;
            }.bind(this));
        },

        update: function (updates) {
            return $http({
                method: "POST",
                url: "/api/v1/decks/update/" + updates.id,
                updates: updates
            }).then(function (response) {
                //this.index.push(response.data);
                console.log("What comes back from a studied update?");
                console.log(response.data);
                return response;
            }.bind(this));
        },

        getOne: function (deckId) {
            return $http({
                method: "GET",
                url: "/api/v1/decks/deck/" + deckId
            });
        },

        study: function (deckArray) {
            return $http({
                method: "POST",
                url: '/api/v1/decks/study',
                data: {decks: deckArray}
            });
        }
    }
}]);