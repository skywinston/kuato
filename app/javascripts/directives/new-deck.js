angular.module('kuato')
.directive('newDeckSummoner', ['$compile', function ($compile) {

    function link (scope, elem) {

        var template = '<new-deck-component></new-deck-component>';

        function renderNewDeck () {
            $compile(template)(scope.$new(true));
        }

        elem.on('click', function () {
            renderNewDeck();
        })
    }

    // Return the directive config object
    return {
        restrict: 'A',
        link: link
    };

}])
.directive('newDeckComponent', ['Deck', "$timeout",  function (Deck, $timeout) {

    // Return directive config object
    return {
        restrict: 'E',
        link: link,
        template:   '<div class="newdeck__container">' +
                        '<input class="newdeck__title" type="text" ng-model="newDeckTitle"/>' +
                        '<div class="deck__buttongroup__mobile">' +
                            '<button class="newdeck__cancel" ng-click="cancelDeck()">Cancel</button>' +
                            '<button class="newdeck__save" ng-click="createCard(newDeckTitle)">Create</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="newdeck__mask"></div>'
    };

    function link (scope, elem) {

        // TODO - Animate elem into view
        $('#app__container').prepend(elem);

        scope.createCard = function (deckTitle) {
            Deck.create(deckTitle)
                .then(function (response) {
                    if (response.data == deckTitle) {
                        // TODO - Animate transition out & destroy scope and remove elem upon successful insertion to db
                        scope.$destroy();
                        elem.remove();
                    }
                });
        };

        scope.cancelDeck = function () {
            $timeout(function(){
                scope.$destroy();
            });

            // TODO - Animate element out and .then() remove elem
            elem.remove();
        }

    }

}]);