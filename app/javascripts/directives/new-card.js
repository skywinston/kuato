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

                // Handles the creation of a new card with no existing values passed in.
                function newCard () {
                    GlobalState.setState(STATE['NEW_CARD']);
                    $rootScope.$broadcast('NEW_CARD');


                    // If we are given a deck id in the attributes, we know that we are creating a new card
                    // using the "add a card to this deck" option in the deck header of card index view
                    if (attrs.deck_id) {
                        GlobalState.setTransition(TRANSITION['CARD_INDEX->NEW_CARD']);
                    } else {
                        GlobalState.setTransition(TRANSITION['DECK_INDEX->NEW_CARD']);
                    }


                    // Determine transitions based on current state
                    switch (GlobalState.getTransition()) {
                        case TRANSITION['DECK_INDEX->NEW_CARD'] :
                            // Get handles on the button elements
                            var $label = elem.find('span');
                            var $button = elem.find('svg');


                            // Animate button rotation and label value changes
                            $label.text('Cancel Card');
                            $button.velocity({
                                rotateZ: "225deg"
                            });

                            var cardWithDeckId = "<kuato-card deck-id=attrs[deckId]></kuato-card>";
                            $compile(cardWithDeckId)(scope.$new(true));
                            break;

                        case STATE['CARD_INDEX'] :
                            // TODO - Revisit this once you have create card from card index view built
                            console.log("creating card from card index state");
                            var template = "<kuato-card></kuato-card>";
                            $compile(template)(scope.$new(true));
                            break;
                    }

                } // END newCard()


                // Handle editing operations on existing cards
                function editCard () {

                    // Log the transition in Global State
                    if (GlobalState.getState() == STATE['CARD_INDEX']) {
                        GlobalState.setTransition(TRANSITION['CARD_INDEX->VIEW_CARD']);
                    }

                    // Check the card-id attr again... (prob dont need to do this twice)
                    if (attrs.cardId) {
                        // Instantiate Isolate Scope & template.
                        var cardScope = scope.$new(true);
                        var template = "<kuato-card></kuato-card>";

                        // Fetch the data unique to this card
                        CardFactory.one(attrs.cardId)
                            .then(function (response) {

                                // Declare state on the scope...
                                var card = response.data;
                                cardScope.navFocus = 'question';
                                cardScope.questionEdit = true;
                                cardScope.answerEdit = true;

                                // ...passing in current values of card from the db
                                for (var prop in card) {
                                    cardScope[prop] = card[prop];
                                }

                                // and compile the directive passing in the scope
                                $compile(template)(cardScope);
                            });
                    }
                } //--  END editCard()  --//


                // Cancel creation of new card, broadcast event to propagate scope destruction and elem removal
                function cancelCard () {
                    // Get handles on the button elements
                    var $label = elem.find('span');
                    var $button = elem.find('svg');

                    // Reverse rotate button & swap label value
                    $label.text('Add Card');
                    $button.velocity({
                        rotateZ: "-0deg"
                    });

                    // Emit event from rootScope to trigger deletion of new-card DOM node & scope
                    $rootScope.$broadcast('CANCEL_CARD');

                }


                // Using the GlobalState, which defaults to "DECK_INDEX", we can getState() and run a switch statement which will
                // produce state-aware transitions/animations
                elem.on('click', function(){
                    console.log("State before switch statement");
                    console.log(GlobalState.getState());
                    switch (GlobalState.getState()) {
                        case STATE['DECK_INDEX'] :
                            newCard();
                            break;
                        case STATE['CARD_INDEX'] :
                            editCard();
                            break;
                        case STATE['STUDYING_QUESTION'] :
                        case STATE['STUDYING_ANSWER'] :
                            editCard();
                            break;
                        case STATE['NEW_CARD'] :
                            cancelCard();
                            break;
                        default :
                            cancelCard();
                    }
                });

            }
        };
}])
.directive('kuatoCard', [
    'Card',
    'GlobalState',
    '$timeout',
    'STATE',
    'TRANSITION',
    function (Card, GlobalState, $timeout, STATE, TRANSITION) {
        return {
            restrict: 'EA',
            templateUrl: "../templates/card.html",
            link: function (scope, elem, attrs) {

                // Which Transition state are we in?  This will determine how we render the element.
                switch (GlobalState.getTransition()) {
                    case TRANSITION['CARD_INDEX->VIEW_CARD'] :
                        console.log("SCOPE for the VIEW CARD from CARD INDEX");
                        console.log(scope);
                        scope.navFocus = 'question';
                        scope.questionEdit = false;
                        scope.answerEdit = false;
                        scope.showQ = true;
                        scope.showA = true;
                        renderNewCard();
                        break;
                    case TRANSITION['STUDY->EDIT_CARD'] :
                    case TRANSITION['DECK_INDEX->NEW_CARD'] :
                    case TRANSITION['CARD_INDEX->NEW_CARD'] :
                        // Set initial state to trigger correct ng-show and ng-hide directives
                        scope.navFocus = 'question';
                        scope.questionEdit = true;
                        scope.answerEdit = true;
                        renderNewCard();
                        break;
                }


                // Listens for cancel event propagated from rootScope and triggers $detroy on isolate scope
                scope.$on('CANCEL_CARD', function () {
                    console.log("CANCELING CARD! DESTROYING SCOPE");
                    GlobalState.setState(STATE['DECK_INDEX']);
                    // $timeout runs after the $digest cycle is complete (regardless of delay parameter), prevents err.
                    $timeout(function(){
                        scope.$destroy();
                    });
                });
                // on $destroy remove the element from the DOM
                scope.$on("$destroy", function () {
                    $('.cards__container').velocity({
                        translateY: "-100%"
                    }, {
                        complete: function () {
                            // Remove the card element directive from the DOM after animation completes
                            elem.remove();
                        }
                    });
                });


                // Manage preview vs edit on Q & A
                scope.previewQ = function () {
                    scope.questionEdit = false;
                    var qOutput = questionMirror.getValue();
                    var markdownQ = marked(qOutput);
                    $('#questionPreviewTarget').html("").append(markdownQ);
                };
                scope.editQ = function () {
                    scope.questionEdit = true;
                    questionMirror.focus();
                };
                scope.previewA = function () {
                    scope.answerEdit = false;
                    var aOutput = answerMirror.getValue();
                    var markdownA = marked(aOutput);
                    $('#answerPreviewTarget').html("").append(markdownA);
                };
                scope.editA = function () {
                    scope.answerEdit = true;
                };


                // CREATE op for a new card resource
                scope.createCard = function () {
                    // TODO — Get the value of both the Q & A cards, POST to the API with other data expected
                    scope.question = questionMirror.getDoc();
                    console.log("Looking for the content of the question editor instance", scope.question);
                };


                //// Render element directive using Global State for animation sequencing
                //switch (GlobalState.getState()) {
                //    case STATE['NEW_CARD']:
                //        renderNewCard();
                //        break;
                //    default:
                //        alert("No default action for rendering this state");
                //}


                function renderExistingCard () {

                }


                function renderNewCard () {
                    // Add card directive element to DOM
                    $('#app__container').prepend(elem);

                    // Get handle on animated elements
                    var $cardContainer = $('.cards__container');

                    // Declare animation sequence for newCard state
                    var entranceSequence = [
                        { e: $cardContainer, p: {translateY: "-100%"}, o: {duration: 0, sequenceQueue: false} },
                        { e: $cardContainer, p: {translateY: 0}, o: {duration: 400, sequenceQueue: false, easing: [.55,0,.1,1]} }
                        // TODO — I think we need a fast-in easing curve instead of a slow-out here.
                    ] ;
                    $.Velocity.RunSequence(entranceSequence);
                }

                // Instantiate CodeMirror Instances
                var questionMirror = new CodeMirror(document.getElementById('questionMirrorTarget'), {
                    mode: 'markdown',
                    lineNumbers: false
                });

                var answerMirror = new CodeMirror(document.getElementById('answerMirrorTarget'), {
                    mode: 'markdown',
                    lineNumbers: false
                });

            } // END link function
        };
}])
.factory('CardFactory', ["$http", function($http){
    // TODO - We may have eliminated the need for this Factory through the refactoring of the Deck index route
    return {
        fetch: fetch,
        one: one
        //all: all
    };

    function fetch () {
        return $http.get('/api/v1/cards');
    }

    // Prob don't need this as I refactored it into fetch above.
    //function all () {
    //    return $http.get('/api/v1/cards');
    //}

    function one (id) {
        return $http.get('/api/v1/cards/' + id);
    }
}]);