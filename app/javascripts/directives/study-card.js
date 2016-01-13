angular.module('kuato')
.directive('studyCard', ["$rootScope", "$timeout", function ($rootScope, $timeout) {

    function link (scope, elem) {
        // Compile Q&A cards into markdown insert into view
        elem.find('#questionPreviewTarget').addClass('fadeInDown').append(marked(scope.question));
        elem.find('#answerPreviewTarget').addClass('fadeInDown').append(marked(scope.answer));

        // Listens for cancel/save event propagated from rootScope and triggers $detroy on isolate scope
        scope.$on('NEXT_CARD', function () {
            $timeout(function(){
                scope.$destroy();
            });
        });

        // on $destroy remove the element from the DOM
        scope.$on("$destroy", function () {
            elem.remove();
        });

        scope.$on('SHOW_ANSWER', function () {
            scope.showAnswer = true;
        });

        scope.$on('HIDE_ANSWER', function () {
            scope.showAnswer = false;
        });

        scope.showAnswer = false;
    }

    return {
        restrict: 'E',
        templateUrl: '../templates/study-card.html',
        link: link
    };

}]);