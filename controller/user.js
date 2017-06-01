/* --------------------------------------------------------------------------
 *  Users manager
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("user", []);

// Server url
var server = "http://localhost:3000";

/*  User profile
 *
 *  Load register user profile
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 */
app.controller('ProfileController',
    function($scope, $http, $location, $auth, $cookies) {

    // Check login status
    if(!$auth.isAuthenticated()) {
        $location.path('/error/401');
    }

    // Get user id from cookie
    var id = $cookies.get("alinua_user");

    // Request user informations from server
    $http.get(server + "/users/user/" + id).then(
        function(response) {
            $scope.user = JSON.parse(response.data);
        },
        function(response) {
            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            $location.path("/error/" + id);
        }
    );
});

/*  User controller
 *
 *  Load user informations from his identifier
 *
 *  Parameters
 *  ----------
 *  id : int
 *      User identifier
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 */
app.controller('UserController',
    function($scope, $http, $routeParams, $location, $auth) {

    // Check login status
    if(!$auth.isAuthenticated()) {
        $location.path('/error/401');
    }

    // Request user informations from server
    $http.get(server + "/users/user/" + $routeParams.id).then(
        function(response) {
            var user = JSON.parse(response.data);

            if(user.status)
                $scope.user = user;

            else
                $location.path("/error/403");
        },
        function(response) {
            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            $location.path("/error/" + id);
        }
    );
});

/*  Users controller
 *
 *  Load users list sorted by last name
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 */
app.controller('UsersController',
    function($scope, $http, $location, $auth) {

    // Check login status
    if(!$auth.isAuthenticated()) {
        $location.path('/error/401');
    }

    // Variables
    $scope.reverse = false;
    $scope.order = "lastName";

    // Request users list from server
    $http.get(server + "/users").then(
        function(response) {
            $scope.users = [];

            for(user in response.data) {
                if(response.data[user].status)
                    $scope.users.push(response.data[user]);
            }
        },
        function(response) {
            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            $location.path("/error/" + id);
        }
    );
});

