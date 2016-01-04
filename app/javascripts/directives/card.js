angular.module('kuato')
.directive('kuatoCard', ['Card', function (Card) {
    return {
        restrict: 'EA',
        scope: {
            _id: '@',
            deck_id: '@',
            question: '=',
            answer: '=',
            rating: '=',
            studied: '=',
            visible: '@'
        },
        templateUrl: "../templates/card.html",
        controller: function ($scope) {
            //$scope.visible = false;
        },
        link: function (scope, elem, attrs) {

            // Instantiate CodeMirror Instances
            var questionMirror = new CodeMirror(document.getElementById('card__question'), {
                mode: 'markdown',
                lineNumbers: true
            });

            var answerMirror = new CodeMirror(document.getElementById('card__answer'), {
                mode: 'markdown',
                lineNumbers: true
            });

        }
    };
}]);