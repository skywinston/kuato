angular.module('kuato')
.directive('cardOperator', [
    "Card",
    "$compile",
    "GlobalState",
    "CardFactory",
    "$rootScope",
    function (Card, $compile, GlobalState, CardFactory, $rootScope){

        return {
            link: function ( scope, elem, attrs ) {


                // Handles the creation of a new card with no existing values passed in.
                function newCard () {
                    GlobalState.setState("creatingNewCard");

                    // Get handles on the button elements
                    var $label = elem.find('span');
                    var $button = elem.find('svg');


                    // Animate button rotation and label value changes
                    // todo — This pushes the search label to the left, it shouldn't move, fix its positioning.
                    $label.text('Cancel Card');
                    $button.velocity({
                        rotateZ: "225deg"
                    });


                    // If this directive is passing in a deckId attribute, render a template that passes that deckId
                    // into the newly created isolate scope.
                    if (attrs.deckId){
                        var cardWithDeckId = "<kuato-card deck-id=attrs[deckId]></kuato-card>";
                        $compile(cardWithDeckId)(scope.$new(true));

                    // And if no deck id is present, we assume its a new card, and the user will select a deck.
                    } else {
                        var template = "<kuato-card></kuato-card>";
                        $compile(template)(scope.$new(true));
                    }
                } // END newCard()


                // Handle editing operations on existing cards
                function editCard () {

                    // todo — Check to see if there is a deck_id or card_id present on the attrs
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
                    $rootScope.$broadcast('cancelNewCard');
                }


                // Using the GlobalState, which defaults to "home", we can getState() and run a switch statement which will
                // produce state-aware transitions/animations

                elem.on('click', function(){
                    switch (GlobalState.getState()) {
                        case "deckIndex" :
                            newCard();
                            break;
                        case "cardIndex" :
                        case "study" :
                            editCard();
                            break;
                        case "creatingCard" :
                            cancelCard();
                            break;
                        default :
                            cancelCard();
                    }
                });

            },
            restrict: 'A'
        };
}])
.directive('kuatoCard', ['Card', 'GlobalState', '$timeout', function (Card, GlobalState, $timeout) {
    return {
        restrict: 'EA',
        templateUrl: "../templates/card.html",
        link: function (scope, elem, attrs) {

            // Set initial state to trigger correct ng-show and ng-hide directives
            scope.navFocus = 'question';
            scope.questionEdit = true;
            scope.answerEdit = true;


            // Listens for cancel event propagated from rootScope and triggers $detroy on isolate scope
            scope.$on('cancelNewCard', function () {
                GlobalState.setState("deckIndex");
                // $timeout runs after the $digest cycle is complete (regardless of delay parameter), prevents err.
                $timeout(function(){
                    scope.$destroy();
                });
            });
            // which will remove the element from the DOM
            scope.$on("$destroy", function () {
                $('.cardnav__container--mobile').velocity({
                    top: "-40px"
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


            // Render element directive using Global State for animation sequencing
            switch (GlobalState.getState()) {
                case "creatingNewCard" :
                    renderNewCard();
                    break;
                default:
                    alert("No default action for rendering this state");
            }


            function renderNewCard () {
                // Add card directive element to DOM
                $('#app__container').prepend(elem);

                // Get handle on animated elements
                var $cardNav = $('.cardnav__container--mobile');
                var $cardContainer = $('.cards__container');

                // Declare animation sequence for newCard state
                var entranceSequence = [
                    { e: $cardNav, p: {translateY: "-40px"}, o: {duration: 0} },
                    { e: $cardContainer, p: {translateY: "-100%"}, o: {duration: 0, sequenceQueue: false} },
                    { e: $cardNav, p: {translateY: 0}, o: {duration: 300 , sequenceQueue: false } },
                    { e: $cardContainer, p: {translateY: 0}, o: {duration: 400, sequenceQueue: false, easing: [.55,0,.1,1]} }
                    // TODO — I think we need a fast-in easing curve instead of a fast-out here.
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

        }
    };
}])
.factory('CardFactory', ["$http", function($http){
    return {
        one: one,
        all: all
    };

    function all () {
        return $http.get('/api/v1/cards');
    }

    function one (id) {
        return $http.get('/api/v1/cards/' + id);
    }
}]);