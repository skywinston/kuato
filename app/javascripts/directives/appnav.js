angular.module('kuato')
.directive('appnav', ["AuthToken", "User", "Card", "$state", function (AuthToken, User, Card, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/appnav.html',
        controller: function ($scope, $compile, $animate) {
            if (!AuthToken.getToken()) { $state.go('login'); } // Guard Clause for authenticated user

            // Logs user out and redirects to 'login' state
            $scope.logout = function(){
                User.logout();
                // todo — refactor this into an animation that pulls the login screen down and then redirects to login state.
                $state.go('login');
            };

            // Toggle New Card Form
            $scope.cardFormVisible = false;
            $scope.newCard = function () {

                // Get handles on button elements
                var $label = $('.appnav__addcard > span');
                var $button = $('.appnav__addcard > svg');

                // Toggle visibility on container element
                $scope.cardFormVisible = !$scope.cardFormVisible;
                // todo — ng-if is not triggering ng-animate classes... why not?

                // Animate conditioned upon value of visibility, toggling value of card form visibility
                if ($scope.cardFormVisible) {// 'Active' state with new card form visible
                    // todo — This pushes the search label to the left, it shouldn't move, fix its positioning.
                    $label.text('Cancel Card');
                    $button.velocity({
                        rotateZ: "225deg"
                    });
                } else if (!$scope.cardFormVisible) {      // 'Inactive state with new card form hidden
                    $label.text('Add Card');
                    $button.velocity({
                        rotateZ: "-0deg"
                    });
                }

            };


            // CREATE new card
            $scope.createCard = function () {
                console.log($scope.test); // Should have 2-way binding to child directive <kuato-card>
            }

        }
    };

}]);

