var app = angular.module('kuato', ['ui.router'])
.config([
    "$httpProvider",
    "$stateProvider",
    "$urlRouterProvider",
    "$locationProvider",
    function config($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider){

        // State Declarations
        $stateProvider
            .state('dashboard', {
                url: '/',
                template: '<kuato-dashboard></kuato-dashboard>'
            })

            .state('login', {
                url: '/login',
                template: '<kuato-login></kuato-login>',
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
}]);
