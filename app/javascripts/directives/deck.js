angular.module('kuato')
.directive('kuatoDeck', [function kuatoDeck(){
    return {
        restrict: 'E',
        templateUrl: './templates/deck.html',
        scope: {
            deck:'@',
            title: '@',
            id: '@',
            ratings: '@',
            timestamp: '@'
        },
        link: function (scope, elem, attrs) {
            console.log("Logging Attrs", attrs);
            scope.data = scope[attrs]
        }
    }
}]);
