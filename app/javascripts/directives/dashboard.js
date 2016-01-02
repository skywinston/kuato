angular.module('kuato')
.directive('kuatoDashboard', ["AuthToken", "Deck", "Choreographer" , "$state", function (AuthToken, Deck, Choreographer, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/dashboard.html',
        controller: function ($scope) {
            if ( !AuthToken.getToken() ) { $state.go('login'); } // Guard clause for active user in local storage

            Deck.all()
                .then(function (response) {
                    $scope.decks = response.data;
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

            $scope.selectAll = function (event) {
                var $elem = $(event.target);
                var $unselected = $('.deck__checkbox--unselected');
                var $dashboard = $('.dashboard__container');
                var $vw = $(window).width();

                // Toggle class on the select all box;
                $elem.toggleClass('dashnav__selectall--unselected dashnav__selectall--selected');

                // If the select all is selected, empty the queued for study array and fill it with every deck id,
                // toggling classes on each checkbox.
                if ($elem.hasClass('dashnav__selectall--selected')) {
                    $unselected.addClass('deck__checkbox--selected').removeClass('deck__checkbox--unselected');
                    $scope.queuedForStudy = [];
                    $scope.decks.forEach(function (deck) {
                        $scope.queuedForStudy.push(deck.id);
                    });
                    console.log("Adding all decks to the queue for study: ", $scope.queuedForStudy);

                    // If on mobile viewport, scale the background and slide in the study sheet
                    if ($vw < 400) {
                        Choreographer.multipleDeckSelection($scope.queuedForStudy);
                    }

                // But if select all box is unselected, remove the selected class from checkboxes and empty the queue
                } else {
                    $selected = $('.deck__checkbox--selected');
                    $selected.removeClass('deck__checkbox--selected').addClass('deck__checkbox--unselected');
                    $scope.queuedForStudy = [];
                    console.log("Removing all decks from the queue: ", $scope.queuedForStudy);
                }
            }
        },

        link: function (scope, elem, attrs) {
            // todo — get a handle on the select all label span and when clicked, make it trigger a click on select all box
        }
    };

}]);