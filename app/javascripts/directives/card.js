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
        link: function (scope, elem, attrs) {

            scope.navStatus = 'question';
            scope.questionEdit = true;
            scope.answerEdit = true;


            // Manage preview vs edit on Q & A
            scope.previewQ = function () {
                scope.questionEdit = false;
                var qOutput = questionMirror.getValue();
                console.log(qOutput);                       // check
                var markdownQ = marked(qOutput);
                console.log(markdownQ);                     // check
                $('#questionPreviewTarget').html("").append(markdownQ);
            };

            scope.createCard = function () {
                scope.question = questionMirror.getDoc();
                console.log("Looking for the content of the question editor instance", scope.question);

                console.log('Creating card from this question: ', scope.question);
            };

            // Instantiate CodeMirror Instances
            var questionMirror = new CodeMirror(document.getElementById('questionMirrorTarget'), {
                mode: 'markdown',
                lineNumbers: false
            });

            var answerMirror = new CodeMirror(document.getElementById('answerMirrorTarget'), {
                mode: 'markdown',
                lineNumbers: false
            });


        }
    };
}]);