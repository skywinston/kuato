angular.module('kuato')
.directive('cardIndex', ['Deck', '$stateParams', '$compile', function (Deck, $stateParams, $compile) {

    function link (scope, elem, attrs) {

        // Handle on insertion points for deck header and card preview components
        var $header = $('.deck__header__container');
        var $index = $('.card__index__container');


        // Build the deck header element & insert into DOM
        scope.deck = Deck.index[$stateParams.id];
        var headerTemplate = '<deck-header></deck-header>';
        var headerScope = scope.$new(true, scope);
        for (var prop in scope.deck) {
            headerScope[prop] = scope.deck[prop]
        }
        $header.append($compile(headerTemplate)(headerScope));


        // For each card in this deck, compile a card element directive passing card data into scope, and append to DOM
        scope.deck.cards.forEach(function (card, index) {
            // Template that builds kuato card directive instance
            var template =  '<preview-card></preview-card>';

            // Scope to pass to template when compiling
            var cardScope = scope.$new(true, scope);
            // TODO - if we pass tags or study-date data in the future, include that here
            cardScope.deckId = card.deck_id;
            cardScope.cardId = card.id;
            cardScope.question = card.question;
            cardScope.rating = card.rating;

            // Compile and append
            var rendered = $compile(template)(cardScope);
            var delay = Number(".0" + index.toString());
            $index.append(rendered).addClass('fadeInUp');
            // TODO - Add animation with .1s delay between each card
        });
    }

    return {
        restrict: 'E',
        templateUrl: '../templates/card-index.html',
        link: link
    };

}])
.directive('deckHeader', [function () {

    function link (scope, elem, attrs) {

    }

    return {
        restrict: 'E',
        templateUrl: '../templates/deck-header.html',
        link: link
    }

}])
.directive('previewCard', [function () {

    function link (scope, elem, attrs) {
        elem.find('.card__preview__content').append(marked(scope.question));
    }

    return {
        restrict: 'E',
        templateUrl: '../templates/preview-card.html',
        link: link
    };

}]);
