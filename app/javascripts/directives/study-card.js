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

        // Listen for updates to cards during studying to update the card currently being studied
        scope.$on('UPDATED_CARD', function (event, updatedCard) {
            // Receive updated card object from card directive and update active card in study view.
            elem.find('#questionPreviewTarget').html("").append(marked(updatedCard.question));
            elem.find('#answerPreviewTarget').html("").append(marked(updatedCard.answer));
        });

        scope.showAnswer = false;


        // If a ques is clicked, emit showAnswer to parent elem
        scope.revealAnswer = function () {
            $rootScope.$broadcast('SHOW_ANSWER');
        };
        scope.hideAnswer = function () {
            $rootScope.$broadcast('HIDE_ANSWER');
        };
    }

    return {
        restrict: 'E',
        templateUrl: '../templates/study-card.html',
        link: link
    };

}]);