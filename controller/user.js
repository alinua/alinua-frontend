/* --------------------------------------------------------------------------
 *  Users manager
 *
 *  Controllers using to manage users (informations, listing, ...)
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
 *  Fetch data from /profile
 */
app.controller('ProfileController',
    function($scope, $window, $rootScope, $location, $auth) {

    // Check login status
    if(!$auth.isAuthenticated()) {
        $location.path('/');
    }

    // Current page
    $scope.path = "/profile";

    // Get user profile from localStorage
    $scope.user = JSON.parse($window.localStorage.user);
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
 *  Fetch data from /network/user/<id>
 */
app.controller('UserController',
    function($scope, $http, $routeParams, $location, $auth) {

    // Check login status
    if(!$auth.isAuthenticated()) {
        $location.path('/');
    }

    // Variables
    $scope.loading = true;

    // Request user informations from server
    $http.get(server + "/users/user/" + $routeParams.id).then(
        function(response) {
            console.debug("Received data from server with success");

            // Parse fetch data
            $scope.user = JSON.parse(response.data);

            // Terminate loading
            $scope.loading = false;
        },
        function(response) {
            console.error("Cannot fetch data from server");

            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            // Redirect to /error/<id>
            $location.path("/error/" + id);
        }
    );
});

/*  Users controller
 *
 *  Load users list sorted by register date
 *
 *  Notes
 *  -----
 *  Fetch data from /network
 */
app.controller('UsersController',
    function($scope, $http, $routeParams, $location, $auth) {

    // Check login status
    if(!$auth.isAuthenticated()) {
        $location.path('/');
    }

    // Variables
    $scope.loading = true;
    $scope.reverse = false;
    $scope.order = "lastName";

    // Current page
    $scope.path = "/network";

    // Request users list from server
    $http.get(server + "/users").then(
        function(response) {
            console.debug("Received data from server with success");

            // Parse fetch data
            $scope.users = response.data;

            // Terminate loading
            $scope.loading = false;
        },
        function(response) {
            console.error("Cannot fetch data from server");

            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            // Redirect to /error/<id>
            $location.path("/error/" + id);
        }
    );
});

