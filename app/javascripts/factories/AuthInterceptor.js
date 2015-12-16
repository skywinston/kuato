angular.module('kuato')
.factory('AuthInterceptor', ["AuthToken", function AuthInterceptorFactory(AuthToken){
    'use strict';
    return {
        request: addToken
    };

    function addToken(config){
        var token = AuthToken.getToken();
        if(token){
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    }
}]);