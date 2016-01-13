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


                $scope.$on('REMOVE_CARD', function () {
                    buttonActive(false, 'Kuato', 'New Card');
                });

                $scope.$on('DECK_INDEX->SHOW_CARD', function (event) {
                    buttonActive(true, 'New Card', 'Cancel Card');
                });

                $scope.$on(TRANSITION['STUDY->EDIT_CARD'], function () {

                });


                // Utility function to handle state/value changes
                function buttonActive (boolean, stateLabel, buttonLabel) {
                    // Get handles on button elements
                    var $label = $('.appnav__addcard > span');
                    var $button = $('.appnav__addcard > svg');


                    // Saved animation that rotates the mini-add-card-FAB in the appnav
                    boolean == true ? $button.velocity({rotateZ: "225deg"}) : $button.velocity({rotateZ: "0deg"});

                    $('.appnav__search > label').text(stateLabel);

                    $label.text(buttonLabel);
                }



            //--------------------------------------------------------//
            // CARD INDEX  -  Logic specific to this state goes here  //
            //--------------------------------------------------------//

                // Set the active deck's title in the menu bar.
                if ($stateParams.id) {
                    console.log("using $stateParams");
                    $scope.activeDeck = Deck.index[$stateParams.id].title;
                }


                $scope.backToDeckIndex = function () {
                    GlobalState.setState(STATE['DECK_INDEX']);
                    $state.go('app');
                };


                // CREATE new card
                $scope.createCard = function () {
                    console.log($scope.test); // Should have 2-way binding to child directive <kuato-card>
                }


            } // END controller //
        };

}]);

