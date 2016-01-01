angular.module('kuato')
.directive('kuatoDashboard', ["AuthToken", "Deck", "$state", function (AuthToken, Deck, $state) {
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

                if (queue.indexOf(id) > -1) {
                    queue.push(id);
                } else {
                    queue.splice(queue.indexOf(id), 1);
                }

            }

        },
        link: function (scope, element, attrs) {

        }
    };

}]);