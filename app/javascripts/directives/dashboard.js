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

                $scope.isDeckEmpty = function (ratingsObject) {
                    for(var key in ratingsObject) {
                        if(ratingsObject.hasOwnProperty(key)){
                                return false;
                        }
                    }
                    return true;
                };

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
                    if (!event) { $state.go('card-index') }

                    var $elem = $(event.target);

                    // TODO — get width, height, and position of $elem
                    var width = $elem.width();
                    var height = $elem.height();
                    var position = $elem.offset();

                    console.log(
                        "Width: ", width, "\n",
                        "Height: ", height, "\n",
                        "Position: ", position, "\n"
                    );



                    // create new element with same position, width, height as $elem & append to body
                    var actor = document.createElement('div');
                    var $actor = $(actor);
                    $actor
                        .addClass('card')
                        .css({
                            width: width,
                            height: height,
                            position: "fixed",
                            "z-index": 90,
                            top: position.top,
                            left: position.left
                        })
                        .appendTo('body');

                    // fade the clicked $elem out so that it doesn't slide under its actor;
                    $elem.velocity({
                        opacity: 0
                    }, {
                        duration: 200
                    });


                    // get handle on all deck items and add class fadeOutDown
                    $('.deck__container').addClass('fadeOutDown');


                    // get handle on decknav and add slideOutUp class
                    $('.dashnav__container').addClass('slideOutUp');

                    // animate from gathered position into top position directly under the appnav
                    // This is conditional upon viewport width to match css styling
                    if ($(window).width() < 600) {
                        $actor.velocity({
                            top: "56px",
                            left: 0,
                            width: "100%",
                            height: "200px"
                        }, {
                            duration: 300,
                            complete: function () {
                                // Set GlobalState to cardIndex
                                GlobalState.setState("cardIndex");

                                // Pass the deckId as params to the new card-index state
                                $state.go('card-index', {id: deckId});

                                // Destroy scope and remove $actor elem
                                $scope.$destroy();
                                $actor.remove();
                            }
                        });
                    } else if ($(window).width() >= 600) {
                        $actor.velocity({
                            top: "56px",
                            left: 0,
                            width: "100%",
                            height: "144px"
                        }, {
                            duration: 300,
                            complete: function () {
                                // Set GlobalState to cardIndex
                                GlobalState.setState("cardIndex");

                                // Pass the deckId as params to the new card-index state
                                $state.go('card-index', {id: deckId});

                                // Destroy scope nad remove $actor elem
                                $scope.$destroy();
                                $actor.remove();
                            }
                        });
                    }

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