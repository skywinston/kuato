angular.module('kuato')
.factory("Choreographer", [
    "$injector",
    "$state",
    function($injector, $state){

        return {
            revealApp: revealApp,
        };

        function revealApp($loginFormDomNode){
            var $elem = $loginFormDomNode;
            var viewportHeight = $elem.height();
            $elem.velocity({
                translateY: -(viewportHeight)
            }, {
                duration: 500,
                easing: $injector.get("fastOut"),
                complete: function () {
                    $state.go('app');
                }
            });
        }

}]);