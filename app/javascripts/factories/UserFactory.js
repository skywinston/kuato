angular.module('kuato')
.factory('User', ["$http", "AuthToken", "$q", "$rootScope", "$window", function UserFactory($http, AuthToken, $q, $rootScope, $window){
    'use strict';
    return {
        login: login,
        logout: logout,
        register: register,
        getUser: getUser,
        readUser: readUser
    };

    function login (email, password){
        return $http.post('/login', {
            email: email,
            password: password
        })
        .then(function success(response){
            var store = $window.localStorage;
            AuthToken.setToken(response.data.token);
            store.setItem('user', response.data.user);
            return response;
        }, function rejected(reason){
            console.log("Rejected bc: ", reason);
        });
    }

    function logout(){
        AuthToken.setToken();  // Sets token to nothing removing it from localStorage.
    }

    function register(email, password){
        return $http.post('/register', {
            email: email,
            password: password
        }).then(function success(response){
            AuthToken.setToken(response.data.token);
            store.setItem('user', response.data.user);
            return response;
        });
    }

    function getUser(){
        if(AuthToken.getToken()){
            return $http.get('/me');
        } else {
            return $q.reject({data: "Client has no auth token"});
        }
    }

    function readUser(){
        var store = $window.localStorage;
        var user = store.getItem('user');
        return user;
    }

}]);
