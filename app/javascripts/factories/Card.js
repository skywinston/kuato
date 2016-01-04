angular.module('kuato')
.factory('Card', [function () {
    return {
        all: all,
        one: one
    };

    // CRUD ops helper functions
    function all () {
        return $http.get('/cards');
    }

    function one (id) {
        return $http.get('/card' + id);
    }

}]);