angular.module('kuato')
.directive('cardIndex', ['Deck', '$stateParams', '$compile', function (Deck, $stateParams, $compile) {

    function link (scope, elem, attrs) {
        // Fetch cards for view using deck_id passed in the URL path
        Deck.getCardsForDeck($stateParams.id)
            .then(function (response) {

                scope.cards = response.data;

                // Get handle on card-index container
                var $index = $('.card__index__container');


                // TODO - forEach over the response.data and build a card element directive using the data in each card
                scope.cards.forEach(function (card, index) {

                    //var questionStringPreview = marked(card.question);

                    // Template that builds kuato card directive instance
                    var template =  '<preview-card></preview-card>';

                    // Scope to pass to template when compiling
                    var cardScope = scope.$new(true);
                    // TODO - if we pass tags or study-date data in the future, include that here
                    cardScope.cardId = card.id;
                    cardScope.question = card.question;
                    cardScope.rating = card.rating;

                    // TODO - Compile and append
                    var rendered = $compile(template)(cardScope);
                    var string = ".0" + index.toString();
                    var delay = Number(string);
                    $index.append(rendered).addClass('fadeInUp');
                    // TODO - Add animation with .1s delay between each card
                });


            });
    }

    return {
        restrict: 'E',
        templateUrl: '../templates/card-index.html',
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