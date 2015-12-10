angular.module('kuato')
.factory('AuthToken', ["$window", function AuthTokenFactory($window){
    'use strict';
    var store = $window.localStorage;
    var key = 'auth-token';
    return {
        getToken: getToken,
        setToken: setToken
    };

    function getToken(){
        return store.getItem(key);
    }

    function setToken(token){
        if (token){
            store.setItem(key, token)
        } else {
            store.removeItem(key);
            store.removeItem('user');
        }
    }
}]);