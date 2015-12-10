angular.module('kuato')
.directive('kuatoDashboard', ["AuthToken", "$state", function (AuthToken, $state) {
    return {
        restrict: "E",
        templateUrl: './templates/dashboard.html',
        controller: function () {
            // Do some cool stuff with the view
        },
        link: function (scope, elem, attrs) {
            if ( !AuthToken.getToken() ) {
                $state.go('login');
            }
            console.log("You're in the DashBoard link function!");
        },
    };
    //console.log(AuthToken.getToken());
    //if( AuthToken.getToken() ){
    //    console.log("No Auth Token Found!");
    //    $state.go('/login');
    //}
}])