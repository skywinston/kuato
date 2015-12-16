var app = angular.module('kuato', ['ui.router'])
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
            .state('dashboard', {
                url: '/',
                template: '<kuato-dashboard></kuato-dashboard>'
            })
            .state('login', {
                url: '/login',
                templateUrl: '../templates/login.html',
                controller: "loginCtrl"
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
}]);
