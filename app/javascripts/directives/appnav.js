angular.module('kuato')
.directive('appnav', [
    "AuthToken",
    "User",
    "Card",
    "Deck",
    "$state",
    "GlobalState",
    "$stateParams",
    "STATE",
    "TRANSITION",
    function (AuthToken, User, Card, Deck, $state, GlobalState, $stateParams, STATE, TRANSITION) {
        return {
            restrict: "E",
            templateUrl: './templates/appnav.html',
            controller: function ($scope, $compile, $animate) {
                if (!AuthToken.getToken()) { $state.go('login'); } // Guard Clause for authenticated user

            //--------------------------------------------------------------------------//
            // STATE INDEPENDENT SCOPE  -  Functionality required regardless of state   //
            //--------------------------------------------------------------------------//

                // Logs user out and redirects to 'login' state
                $scope.logout = function(){
                    User.logout();
                    // todo — refactor this into an animation that pulls the login screen down and then redirects to login state.
                    $state.go('login');
                };


                // configure state for the appnav
                $scope.state = GlobalState.getState();


            //--------------------------------------------------------------------------//
            // STATE BASED WATCHERS -  Changes behavior based on state                  //
            //--------------------------------------------------------------------------//

                $scope.$watch('GlobalState.state', function () {
                    $scope.state = GlobalState.getState();
                });

                //$scope.$watch('GlobalState.transition', function manageTransition () {
                //    // Animate appnav elements based on state transitions
                //    switch (GlobalState.getTransition()) {
                //        case TRANSITION['CARD_INDEX->DECK_INDEX'] :
                //            $('.appnav__backToDeckIndex').velocity({
                //                translateX: "32px",
                //                opacity: 0
                //            }, {
                //                duration: 200,
                //                complete: function (elem) {
                //                    elem.hide();
                //                }
                //            });
                //            break;
                //        case TRANSITION['DECK_INDEX->CARD_INDEX'] :
                //            $('.appnav__backToDeckIndex').velocity({
                //                translateX: "0px",
                //                opacity: 1
                //            }, {
                //                duration: 200,
                //                begin: function (elem) {
                //                    elem.show();
                //                }
                //            });
                //            break;
                //
                //    }
                //});





            //--------------------------------------------------------//
            // CARD INDEX  -  Logic specific to this state goes here  //
            //--------------------------------------------------------//

                // Set the active deck's title in the menu bar.
                if ($stateParams.id) {
                    console.log("using $stateParams");
                    $scope.activeDeck = Deck.index[$stateParams.id].title;
                }




                $scope.backToDeckIndex = function () {
                    GlobalState.setTransition(TRANSITION['CARD_INDEX->DECK_INDEX']);
                    $state.go('app');
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

