var app = angular.module('kuato', ['ngAnimate', 'ui.router'])
.constant("fastOut", [.55,0,.1,1])
.config([
    "$httpProvider",
    "$stateProvider",
    "$urlRouterProvider",
    "$locationProvider",
    function config($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider){

        // Config Auth Interceptors to send Token (if present) with all requests
        $httpProvider.interceptors.push('AuthInterceptor');

        // State Declarations
        $stateProvider
            .state('app', {
                url: '/',
                templateUrl: './templates/app.html'
                // todo — look into substates for the app (dashboard/deckview/cardview)
            })
            .state('login', {
                url: '/login',
                templateUrl: '../templates/login.html',
                controller: "loginCtrl"
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
}]);
