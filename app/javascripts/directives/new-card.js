angular.module('kuato')
.directive('cardOperator', [
    "Card",
    "$compile",
    "GlobalState",
    "CardFactory",
    "$rootScope",
    "STATE",
    "TRANSITION",
    function (Card, $compile, GlobalState, CardFactory, $rootScope, STATE, TRANSITION){

        return {
            restrict: 'A',
            link: function ( scope, elem, attrs ) {

                elem.on('click', function(){
                    switch (GlobalState.getState()) {
                        case STATE['DECK_INDEX'] :
                            $rootScope.$broadcast(TRANSITION['DECK_INDEX->SHOW_CARD']);
                            renderCard();
                            break;
                        case STATE['CARD_INDEX'] :
                            renderCard();
                            break;
                        case STATE['STUDYING'] :
                            renderCard();
                            break;
                        case STATE['SHOW_CARD'] :
                            GlobalState.setState(GlobalState.getPrevState());
                            removeCard();
                            break;
                    }
                });

                function renderCard () {
                    var template = '<kuato-card></kuato-card>';
                    var cardScope = scope.$new(true);
                    for (var prop in attrs) {
                        cardScope[prop] = attrs[prop];
                    }
                    $compile(template)(cardScope);
                }


                function removeCard () {
                    $rootScope.$broadcast('REMOVE_CARD');
                }

            }
        };
}])
.directive('kuatoCard', [
    'CardFactory',
    'Deck',
    'GlobalState',
    '$timeout',
    'STATE',
    'TRANSITION',
    function (CardFactory, Deck, GlobalState, $timeout, STATE, TRANSITION) {


        function link (scope, elem, attrs) {
            // Sets State to SHOW_CARD
            GlobalState.setState(STATE['SHOW_CARD']);

            // If a card id is present on scope, fetch it
            if (scope.cardId) {
                CardFactory.one(scope.cardId)
                    .then(function (response) {
                        scope.activeCard = response.data;

                        // Prep the CodeMirror instances with their values
                        questionMirror.setValue(scope.activeCard.question);
                        answerMirror.setValue(scope.activeCard.answer);

                        // Show preview or edit side of card, based on params passed into card-operations directive
                        if (scope.preview) {
                            // Preview is true, so we need to render the preview content
                            $('#questionPreviewTarget').append(marked(scope.activeCard.question));
                            $('#answerPreviewTarget').append(marked(scope.activeCard.answer));
                            scope.questionEdit = false;
                            scope.answerEdit = false;
                        } else {
                            // Preview is false, which means we need CM Editors shown for edit operation
                            scope.questionEdit = true;
                            scope.answerEdit = true;
                        }
                    });
            }

        //---------------------------------------------------//
        // SET UP LISTENERS FOR REMOVAL OF ELEMENT DIRECTIVE //
        //---------------------------------------------------//

            // Listens for cancel/save event propagated from rootScope and triggers $detroy on isolate scope
            scope.$on('REMOVE_CARD', function () {
                console.log("REMOVING CARD! DESTROYING SCOPE");
                $timeout(function(){
                    scope.$destroy();
                });
            });

            // on $destroy remove the element from the DOM
            scope.$on("$destroy", function () {
                // TODO - Animate out with scale back
                // ...but for now just remove it.
                elem.remove();
            });


        //----------------------------------------------------------//
        // SCOPE METHODS TO MANAGE PREVIEW VS EDIT + SAVE NEW CARDS //
        //----------------------------------------------------------//

            // Manage preview vs edit on Q & A
            scope.previewQ = function () {
                scope.activeCard = scope.activeCard || {};
                scope.activeCard.question = questionMirror.getValue();
                scope.questionEdit = false;
                $('#questionPreviewTarget').html("").append(marked(scope.activeCard.question));
            };
            scope.editQ = function () {
                scope.questionEdit = true;
                if (scope.activeCard) {
                    questionMirror.setValue(scope.activeCard.question);
                    questionMirror.focus();
                    questionMirror.refresh();
                }

            };
            scope.previewA = function () {
                scope.activeCard = scope.activeCard || {};
                scope.activeCard.answer = answerMirror.getValue();
                scope.answerEdit = false;
                $('#answerPreviewTarget').html("").append(marked(scope.activeCard.answer));
            };
            scope.editA = function () {
                scope.answerEdit = true;
                if (scope.activeCard) {
                    answerMirror.setValue(scope.activeCard.answer);
                    answerMirror.focus();
                    answerMirror.refresh();
                }
            };

            scope.saveCard = function () {
                // TODO - get value from selectize component

                // deck will be equal to the deck id (number) if it exists, or a string of the new deck title
                var selected = $select[0].value;
                console.log(selected);

                // If the returned id is already in the Deck.index, update it.
                if (Deck.index.hasOwnProperty(selected)) {
                    console.log("Deck ID found!");
                    // build PATCH data object
                    var updates = {};
                    updates.id = scope.activeCard.id;
                    updates.deck_id = selected;
                    updates.question = questionMirror.getValue();
                    updates.answer = answerMirror.getValue();

                    CardFactory.update(updates)
                        .then(function (response) {
                            console.log("Did the card get updated?");
                            console.log(response.data);
                        });
                }

            };

        //----------------------------------------------------------//
        // CONFIGURE INTERFACE ELEMENTS AND INSERT INTO DOM         //
        //----------------------------------------------------------//

            // Add card directive element to DOM
            $('#app__container').prepend(elem);

            // Rotate appnav Add button
            // TODO - Get handle on and rotate appnav add button

            // Instantiate CodeMirror Instances
            var questionMirror = CodeMirror(document.getElementById('questionMirrorTarget'), {
                mode: 'markdown',
                lineNumbers: false,
                viewportMargin: Infinity,
                autofocus: true,
                tabindex: 2,
                lineWrapping: true
            });

            var answerMirror = CodeMirror(document.getElementById('answerMirrorTarget'), {
                mode: 'markdown',
                lineNumbers: false,
                viewportMargin: Infinity,
                autofocus: true,
                tabindex: 3,
                lineWrapping: true
            });

            // Accumulate all decks into options object array for selectize component
            scope.myOptions = [];
            for (var prop in Deck.index) {
                scope.myOptions.push(Deck.index[prop]);
            }

            var $select = $('.deck__selection').selectize({
                options: scope.myOptions,
                create: true,
                valueField: 'id',
                labelField: 'title',
                searchField: ['title'],
                placeholder: 'Add to deck',
                maxItems: 1
            });

            // Initialize select value by passing in scope id (the card's id)
            if (scope.deckId) {
                $select[0].selectize.setValue(scope.deckId);
            }

            console.log("Context in scope", scope);
            // If there is a context-attribute, then we know exactly which element it came from
            if (scope.context == 'preview-card') {
                // We could do context-aware animations from these conditionals
                // TODO - In the attribute directive, we need to pass in a context attr and then match that to a conditional block here
            }
            
        } // END - function link ()

        return {
            restrict: 'EA',
            templateUrl: "../templates/card.html",
            link: link
        };

}])
.factory('CardFactory', ["$http", "Deck", function($http, Deck){
    // TODO - We may have eliminated the need for this Factory through the refactoring of the Deck index route
    return {
        fetch: fetch,
        one: one,
        update: update
    };

    function fetch () {
        return $http.get('/api/v1/cards');
    }

    function one (id) {
        return $http.get('/api/v1/cards/' + id);
    }

    function update (updates) {
        return $http({
            method: "POST",
            url: "/api/v1/cards/update/" + updates.id,
            data: updates
        }).then(function (response) {
            console.log(response.data);
            // TODO - Search the Deck index by deck_id and replace the updated card in the cards array
            Deck.index[response.data.deck_id].cards.forEach(function (card, i, arr) {
                if (card.id = response.data.id) {
                    arr[i] = response.data;
                }
            });
            return response;
        })
    }
}]);