angular.module('kuato')
.controller('studyCtrl', [
    "$scope",
    "$compile",
    "$stateParams",
    "Deck",
    "GlobalState",
    "STATE",
    function studyController ($scope, $compile, $stateParams, Deck, GlobalState, STATE) {
        // Set Global State
        GlobalState.setState(STATE['STUDYING']);

        // Fetch cards for study
        Deck.study($stateParams.decks) // TO -> decks.js
            .then( function (response) {

                // Initialize scope with queued, active, and reviewed values
                $scope.queued = response.data;

                // Load the first card from the array into the active slot (the card the studier sees first).
                $scope.active = $scope.queued.shift();

                $scope.reviewed = [];

                renderCard();
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



        $scope.nextCard = function () {
            $scope.reviewed.push($scope.active);
            $scope.active = $scope.queued.shift();
            renderCard();
        };

        $scope.prevCard = function () {
            $scope.queued.unshift($scope.active);
            $scope.active = $scope.reviewed.pop();
        };


        $scope.rateCard = function () {

        }

}]);