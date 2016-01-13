angular.module('kuato')
.directive('studyCard', [function () {

    function link (scope, elem) {
        // Compile Q&A cards into markdown insert into view
        elem.find('#questionPreviewTarget').addClass('fadeInDown').append(marked(scope.question));
        elem.find('#answerPreviewTarget').addClass('fadeInDown').append(marked(scope.answer));
    }

    return {
        restrict: 'E',
        templateUrl: '../templates/study-card.html',
        link: link
    };

}]);