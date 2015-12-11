angular.module('kuato')
.controller('sessionController', ['$scope', 'AuthToken' , function sessionController($scope, AuthToken){
    if ( !AuthToken.getToken() ) {
        $scope.sessionIsActive = false;
    } else {
        $scope.sesssionIsActive = true;
    }
}])