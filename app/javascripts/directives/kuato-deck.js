angular.module('kuato')
.directive('kuatoDeck', ["Deck", function (Deck) {

    function link (scope, elem, attrs) {
        // TODO - pass in deck-id as attr from the deck index view.

        // Initialize content
        Deck.getCardsForDeck(attrs.deckId)
            .then(function (response) {
                scope.cards = response.data || [];
            });

        // Other stuff...
    }

    return {
        restrict: 'E',
        templateUrl: '../templates/deck.html',
        link: link
    };

}]);