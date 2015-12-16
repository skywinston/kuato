angular.module('kuato')
.directive('kuatoLogin', [function kuatoLoginDirective(){
    return {
        restrict: "E",
        templateUrl: "templates/login.html",
        scope: {}
    };
}])
