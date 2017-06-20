/* --------------------------------------------------------------------------
 *  Home page
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("main", []);

// Server url
var server = "http://localhost:3000";

/*  Home controller
 *
 *  Manage authenticate with localStorage and cookies usage
 */
app.controller('MainController',
    function($scope, $window, $http, $location) {

    // Request user informations from server
    $http.get(server + "/users").then(
        function(response) {
            $scope.users = response.data;
        },
        function(response) {
            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            $location.path("/error/" + id);
        }
    );

    // Request jobs informations from server
    $http.get(server + "/jobs").then(
        function(response) {
            $scope.jobs = response.data;
        },
        function(response) {
            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            $location.path("/error/" + id);
        }
    );

    // Request projects informations from server
    $http.get(server + "/projects").then(
        function(response) {
            $scope.projects = response.data;
        },
        function(response) {
            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            $location.path("/error/" + id);
        }
    );
});
