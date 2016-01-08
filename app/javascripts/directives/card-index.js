angular.module('kuato')
.directive('cardIndex', ['Deck', '$stateParams', function (Deck, $stateParams) {

    function link (scope, elem, attrs) {
        // TODO - Get the deck-id from url params & pass it in to getCardsForDeck();
        console.log("What's in the $stateParams: ", $stateParams);
        Deck.getCardsForDeck()
            .then(function (cards) {
                console.log(cards);
            });

        scope.test = true;
    }

    return {
        restrict: 'E',
        link: link,
        templateUrl: '../templates/card-index.html'
    }

}]);