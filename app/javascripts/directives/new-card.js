angular.module('kuato')
.directive('newCardBtn', ["Card", "$compile", "GlobalState", "CardFactory", function(Card, $compile, GlobalState, CardFactory){

    return {
        link: function ( scope, elem, attrs ) {
            function renderCard () {

                // TODO — This is redundant with <kuato-card> directive... DRY it up

                // todo — Check to see if there is a deck_id or card_id present on the attrs
                if (attrs.cardId) {
                    // Instantiate Isolate Scope & template.
                    var cardScope = scope.$new(true);
                    var template = "<new-card></new-card>";


                    // Fetch the data unique to this card
                    CardFactory.one(attrs.cardId)
                        .then(function (response) {

                            // Declare state on the scope...
                            var card = response.data;
                            cardScope.navFocus = 'question';
                            cardScope.questionEdit = true;
                            cardScope.answerEdit = true;

                            // ...passing in current values of card from the db
                            for (var prop in card) {
                                console.log("each prop in card: ", card[prop]);
                                cardScope[prop] = card[prop];
                            }

                            // and compile the directive passing in the scope
                            $compile(template)(cardScope);
                        });
                }

                //$compile(template)(scope.$new(true));
            }

            // todo — how does existing card data bind to the <new-card> directive (in the case of edit ops)?

            // Using the GlobalState, which defaults to "home", we can getState() and run a switch statement which will
            // produce state-aware transitions/animations

            elem.on('click', function(){
                renderCard();
            });
        },
        restrict: 'A'
    };
}])
.directive('newCard', ["CardFactory", function(CardFactory){
    return {
        restrict: 'E',
        templateUrl: "../templates/card.html",
        link: function (scope, elem, attrs) {
            console.log("There should be a scope matching the card obj from the db: ", scope);
            
            $('#app__container').prepend(elem);
            console.log("Card Created!");
        }
    }
}])
.factory('CardFactory', ["$http", function($http){
    return {
        one: one,
        all: all
    };

    function all () {
        return $http.get('/api/v1/cards');
    }

    function one (id) {
        return $http.get('/api/v1/cards/' + id);
    }
}]);