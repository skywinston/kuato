angular.module('kuato')
.controller('studyCtrl', [
    "$scope",
    "$rootScope",
    "$compile",
    "$stateParams",
    "Deck",
    "CardFactory",
    "GlobalState",
    "STATE",
    "$state",
    function studyController ($scope, $rootScope, $compile, $stateParams, Deck, CardFactory, GlobalState, STATE, $state) {
        // Set Global State
        GlobalState.setState(STATE['STUDYING']);

        // Fetch cards for study
        Deck.study($stateParams.decks) // TO -> decks.js
            .then( function (response) {

                // Initialize scope with queued, active, and reviewed values
                $scope.queued = response.data;

                // Set inPlay attribute on each card object to determine how long the card stays in play.
                // Set reviewed property to count incidences of study during this session.
                $scope.queued.forEach( function (card) {
                    card.inPlay = true;
                    card.reviewed = 0;
                });

                // Load the first card from the array into the active slot (the card the studier sees first).
                $scope.active = $scope.queued.shift();

                $scope.reviewed = [];

                $scope.doneStudying = $scope.queued.length == 0;

                renderCard();
            });


        // Listen for updates to the active card and make sure this scope updates that card object.
        $scope.$on('UPDATED_CARD', function (event, updatedCard) {
            // Receive updated card object from card directive and update active card in this controller.
            $scope.active = updatedCard;
        });


        // Listen for clicks on the study-card questions and answers to toggle their visibility
        $scope.$on('SHOW_ANSWER', function () {
           $scope.showAnswer = true;
        });
        $scope.$on('HIDE_ANSWER', function() {
            $scope.showAnswer = false;
        });


        // Function to compile <kuato-card></kuato-card> directive using active card for scope
        function renderCard () {
            // Prep template & scope
            var template = '<study-card></study-card>';
            var cardScope = $scope.$new(true);

            // Populate scope with contents of active card
            for (var prop in $scope.active) {
                cardScope[prop] = $scope.active[prop];
            }

            // Compile element directive
            $('#currentCardTarget').append($compile(template)(cardScope));
            // TO -> study-card.js
        }


        // Starts with only the q visible
        $scope.showAnswer = false;

        $scope.nextCard = function () {
            // Guard clause to end studying if no more cards are queued for study.
            $scope.doneStudying = $scope.queued.length == 0;
            if ($scope.doneStudying) return;

            $rootScope.$broadcast('NEXT_CARD');
            $scope.toggleShowAnswer();
            $scope.reviewed.push($scope.active);
            $scope.active = $scope.queued.shift();
            renderCard();
        };

        $scope.prevCard = function () {
            $scope.queued.unshift($scope.active);
            $scope.active = $scope.reviewed.pop();
            renderCard();
        };

        $scope.rateCard = function (rating) {
            // How many times has this card been reviewed during this session?
            $scope.active.reviewed++;

            // This will shuffle the card back into the deck based on the rating.
            switch (rating) {
                case 1 :
                    // Remove from play
                    $scope.active.inPlay = false;

                    processUpdates(rating);
                    break;

                case 2 :
                    // Add back into deck at the end (shows up less frequently)
                    $scope.queued.push($scope.active);

                    processUpdates(rating);
                    break;

                case 3 :
                    // Add back into the deck in the middle (shows up more often)
                    var queueLen = $scope.queued.length;
                    queueLen % 2 == 0 ?
                        $scope.queued.splice(queueLen/2 - 1, 1, $scope.active) :
                        $scope.queued.splice( (queueLen-1) / 2, 1, $scope.active);
                    processUpdates(rating);
                    break;
            }
        };


        // processes card ratings by making changes to state in controller and calling the api with updates
        function processUpdates (rating) {
            // First rating is the one recorded in the database.
            if ($scope.active.reviewed == 1) {
                $scope.active.rating = rating;
                // Build updates object removing properties used by study controller that don't conform to schema.
                var updates = $scope.active;
                delete updates.reviewed;
                delete updates.inPlay;

                // Send updates to API
                CardFactory.update(updates)
                    .then(function (updatedCard) {
                        console.log("Updates to active card during study.  Check the rating.");
                        console.log(updatedCard);

                        if (rating == 2) {

                        }
                        $scope.nextCard();
                    });

            } else {
                $scope.nextCard();
            }
        }


        $scope.toggleShowAnswer = function () {
            $scope.showAnswer = !$scope.showAnswer;
            if ($scope.showAnswer) {
                $rootScope.$broadcast('SHOW_ANSWER');
            } else {
                $rootScope.$broadcast('HIDE_ANSWER');
            }
        };

        $scope.endStudying = function () {
            // TODO - Check previous state of the world and return to that state
            $state.go("app");
        };

}]);