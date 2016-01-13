angular.module('kuato')
.controller('studyCtrl', [
    "$scope",
    "$rootScope",
    "$compile",
    "$stateParams",
    "Deck",
    "GlobalState",
    "STATE",
    "$state",
    function studyController ($scope, $rootScope, $compile, $stateParams, Deck, GlobalState, STATE, $state) {
        // Set Global State
        GlobalState.setState(STATE['STUDYING']);

        // Fetch cards for study
        Deck.study($stateParams.decks) // TO -> decks.js
            .then( function (response) {

                // Initialize scope with queued, active, and reviewed values
                $scope.queued = response.data;

                console.log($scope.queued.length);

                // Load the first card from the array into the active slot (the card the studier sees first).
                $scope.active = $scope.queued.shift();

                $scope.reviewed = [];

                $scope.doneStudying = $scope.queued.length == 0 ? true : false;

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
            // rating is 1, 2, or 3
            // TODO - do the update op on the card
            // TODO - In the .then(), fire $scope.nextCard();
            $scope.nextCard();
        };

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