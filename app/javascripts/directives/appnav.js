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
            //--------------------------------------------------------------------------//'

                $scope.$on('NEW_CARD', function(){
                    $('.appnav__search > label').text("New Card");
                });

                $scope.$on('CANCEL_CARD', function(){
                   $('.appnav__search > label').text("Kuato");
                });

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

                $scope.$on('CANCEL_CARD', function () {
                    $scope.state = GlobalState.getState();
                    console.log("STATE after cancel card in appnav.js controller");
                    console.log($scope.state);
                });



            //--------------------------------------------------------//
            // DECK INDEX  -  Logic specific to this state goes here  //
            //--------------------------------------------------------//


                
                


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


                // Initialize card form visible
                $scope.cardFormVisible = false;


                // Renders a new card form.
                $scope.newCard = function () {

                    // Toggle visibility on container element
                    $scope.cardFormVisible = !$scope.cardFormVisible;
                    // todo — ng-if is not triggering ng-animate classes... why not?


                    if (GlobalState.getState() == STATE['DECK_INDEX']) {

                        // Get handles on button elements
                        var $label = $('.appnav__addcard > span');
                        var $button = $('.appnav__addcard > svg');

                        // Saved animation that rotates the mini-add-card-FAB in the appnav
                        var rotatePlusBtn = $button.velocity({
                            rotateZ: "225deg"
                        });

                        $label.text('Cancel Card');
                        rotatePlusBtn();

                    } else if (GlobalState.getState() == STATE['CANCEL_CARD'] && GlobalState.getPrevState() == 'NEW_CARD') {

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

