angular.module('kuato')
.directive('cardIndex', ['Deck', '$stateParams', '$compile', function (Deck, $stateParams, $compile) {

    function link (scope, elem, attrs) {

        // Build the deck header element
        scope.deck = Deck.index[$stateParams.id];



        // Get handle on containers where we'll append card preview directive elements
        var $index = $('.card__index__container');

        // For each card in this deck, compile a card element directive passing card data into scope
        scope.deck.cards.forEach(function (card, index) {
            console.log(card);

            // Template that builds kuato card directive instance
            var template =  '<preview-card></preview-card>';

            // Scope to pass to template when compiling
            var cardScope = scope.$new(true, scope);
            // TODO - if we pass tags or study-date data in the future, include that here
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
.directive('previewCard', [function () {

    function link (scope, elem, attrs) {
        elem.find('.card__preview__content').append(marked(scope.question));
    }

    return {
        restrict: 'E',
        templateUrl: '../templates/preview-card.html',
        link: link
    };

}])
.directive('deckHeader', [function () {

    function link (scope, elem, attrs) {

    }

    return {
        restrict: 'E',
        template: '',
        link: link
    }

}]);