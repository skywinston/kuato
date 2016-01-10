angular.module('kuato')
.directive('kuatoDashboard', [
    "AuthToken",
    "Deck",
    "Choreographer" ,
    "$state",
    "$location",
    "GlobalState",
    "STATE",
    "TRANSITION",
    function (AuthToken, Deck, Choreographer, $state, $location, GlobalState, STATE, TRANSITION) {

        return {
            restrict: "E",
            templateUrl: './templates/dashboard.html',
            controller: function ($scope) {
                if ( !AuthToken.getToken() ) { $state.go('login'); } // Guard clause for active user in local storage

                GlobalState.setState(STATE['DECK_INDEX']);

                
                // Initialize scope with fetching of all deck resources
                Deck.fetch().then(function(){
                    $scope.decks = Deck.index || {};
                });
                

                // TODO - Watch for changes to Deck.index, which updates ng-repeat directive with new decks
                $scope.$watch('Deck.index', function (newValue, oldValue) {
                   $scope.decks = newValue;
                });
                

                // Adds or removes deck IDs into the study queue
                $scope.queuedForStudy = [];
                $scope.toggleStudyThisDeck = function(event, id) {
                    var $elem = $(event.target);
                    $elem.toggleClass('deck__checkbox--selected deck__checkbox--unselected');

                    var queue = $scope.queuedForStudy;

                    if (queue.indexOf(id) === -1) {
                        queue.push(id);
                        console.log('Adding deck ' + id + ' to the queue: ', $scope.queuedForStudy);
                    } else {
                        queue.splice(queue.indexOf(id), 1);
                        console.log('Removing deck ' + id + ' from the queue: ', $scope.queuedForStudy);
                    }

                };


                // Handle the select all box selection
                $scope.selectAll = function (event) {
                    var $elem = $("#dashnav__selectall");
                    var $unselected = $('.deck__checkbox--unselected');

                    // Toggle class on the select all box;
                    $elem.toggleClass('dashnav__selectall--unselected dashnav__selectall--selected');

                    // If the select all is selected, empty the queued for study array and fill it with every deck id,
                    // toggling classes on each checkbox.
                    if ($elem.hasClass('dashnav__selectall--selected')) {
                        $unselected.addClass('deck__checkbox--selected').removeClass('deck__checkbox--unselected');
                        $scope.queuedForStudy = [];
                        for (var id in $scope.decks) {
                            $scope.queuedForStudy.push(Number(id));
                        }
                        console.log("Adding all decks to the queue for study: ", $scope.queuedForStudy);

                    // But if select all box is unselected, remove the selected class from checkboxes and empty the queue
                    } else {
                        $selected = $('.deck__checkbox--selected');
                        $selected.removeClass('deck__checkbox--selected').addClass('deck__checkbox--unselected');
                        $scope.queuedForStudy = [];
                        console.log("Removing all decks from the queue: ", $scope.queuedForStudy);
                    }
                };


                // Handle creation of new deck
                $scope.newDeck = false;  // initialize view controller value as false (new deck form hidden by default)


                // View a deck
                $scope.viewDeck = function (deckId, event) {
                    // QUESTION — Why is this guard clause here?
                    // ANSWER - What if you want to view a deck after creating it?
                    if (!event) { $state.go('card-index') } // Assume a user pastes a url to a particular deck
                    

                    // User wants to view a deck by clicking on "view cards" on the deck
                    if (GlobalState.getState() == STATE['DECK_INDEX']) {

                        // Configure transition between states
                        GlobalState.setTransition(TRANSITION['DECK_INDEX->CARD_INDEX']);

                        // Get handle on deck corresponding to clicked element
                        var $elem = $(event.target).closest('.deck__wrapper');
                        console.log($elem);

                        // Get width, height, and position offset of deck element
                        var width = $elem.width();
                        var height = $elem.height();
                        var position = $elem.offset();

                        // create new element with same position, width, height as deck element & append to body
                        var actor = document.createElement('div');
                        var $actor = $(actor);
                        $actor
                            .addClass('card')
                            .css({
                                width: width,
                                height: height,
                                position: "fixed",
                                "z-index": 90,
                                top: position.top - $(window).scrollTop(),
                                left: position.left - $(window).scrollLeft(),
                                "border-radius": "12px"
                            })
                            .appendTo('body');

                        // Calculate end state of deck header based on viewport width
                        var actorStyles = $(window).width() < 600 ? {
                                top: "56px",
                                left: 0,
                                width: "100%",
                                height: "200px",
                                "border-radius": "0px"
                            } : {
                                top: "56px",
                                left: 0,
                                width: "100%",
                                height: "144px",
                                "border-radius": "0px"
                            };

                        // Include every other deck element in the animation sequence
                        var $decks = $('.deck__container');
                        var sequence = $.map($decks, function(deck, i){
                            var callObject = {
                                e: deck,
                                p: {
                                    opacity: 0
                                },
                                o: {
                                    sequenceQueue: false,
                                    duration: Number("300.0" + i.toString())
                                }
                            };
                            if (i == $decks.length-1) {
                                callObject.o.complete = function () {
                                    GlobalState.setState(STATE['CARD_INDEX']);
                                    $.Velocity({e: $actor, p: actorStyles, o: {duration: 300, easing: [.55,0,.1,1], sequenceQueue: false}})
                                        .then(function(){
                                            // Pass the deckId as params to the new card-index state
                                            $state.go('card-index', {id: deckId});

                                            // Destroy scope and remove $actor elem
                                            $scope.$destroy();
                                            $actor.remove();
                                        });
                                }
                            }

                            return callObject;
                        });
                        // Have the first animation turn opacity all the way down immediately on the clicked deck.
                        sequence.unshift({e: $elem, p: {opacity: 0}, o: {duration: 0, sequenceQueue: false}});
                        // Then run the animation sequence, which when complete, will redirect to the card index state.
                        $.Velocity.RunSequence(sequence);

                    } // END Condition: Transitioning from Deck Index to Card Index

                }; // END viewDeck()


                // Study selected decks
                $scope.studyDecks = function (decks) {

                    console.log("Decks to study are: ", decks);
                    console.log("")

                    // todo — how to transition state passing array of decks queued for study from this scope
                };


            } // END controller
        };

}]);