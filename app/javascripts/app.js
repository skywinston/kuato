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
                templateUrl: '../templates/app.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: '../templates/login.html',
                controller: "loginCtrl"
            })
            .state('card-index', {
                url: '/deck/:id',
                //templateUrl: '../templates/card-index.html',
                // or use a directive template...
                template: "<appnav></appnav><card-index></card-index>"
            })
            .state('study', {
                url: '/study',
                templateUrl: '../templates/study.html',
                controller: 'studyCtrl',
                params: {
                    decks: null
                }
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);


        // Config marked markdown parser to use highlight.js for <code> highlighting
        marked.setOptions({
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            }
        });
}]);
