angular.module('kuato')
.factory('GlobalState', ["$state", function($state){
    return {
        state: this.state || "deckIndex",
        setState: setState,
        getState: getState
    };

    function setState (state) {
        this.state = state;
    }

    function getState () {
        return this.state;
    }
}]);