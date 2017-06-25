/* --------------------------------------------------------------------------
 *  Users manager
 *
 *  Load users list and user's profile
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("user", []);

// Server url
var server = "http://localhost:3000";

/* --------------------------------------------------------------------------
 *  Network controller
 *
 *  Loading users list (default sorting: last name)
 * -------------------------------------------------------------------------- */
app.controller('NetworkController',
    function($auth, $http, $location, $scope) {

    /* -----------------------------------
     *  Variables
     * ----------------------------------- */

    $scope.loading = true;

    $scope.reverse = false;
    $scope.order = "lastName";

    /* -----------------------------------
     *  Request data
     * ----------------------------------- */

    // Request users list from server
    $http.get(server + "/users").then(
        function(response) {
            $scope.users = [];

            for(user in response.data) {
                // Only see validate users
                if(response.data[user].status)
                    $scope.users.push(response.data[user]);
            }

            $scope.loading = false;
        },
        function(response) {
            $location.path("/error/" + (
                response.status == -1 ? "503" : response.status));
        }
    );
});

/* --------------------------------------------------------------------------
 *  User controller
 *
 *  Loading user informations
 *
 *  /profile
 *      Loading informations from identifier stored in cookie
 *
 *  /network/user/:id
 *      Loading informations from url identifier
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 * -------------------------------------------------------------------------- */
app.controller('UserController',
    function($auth, $cookies, $http, $location, $routeParams, $scope) {

    // Check login status
    if(!$auth.isAuthenticated())
        $location.path('/error/401');

    /* -----------------------------------
     *  Variables
     * ----------------------------------- */

    $scope.loading = true;

    // Get cookie if current path is profile
    if($location.path() == "/profile")
        var identifier = $cookies.get("alinua_user");

    // Get url identifier instead
    else
        var identifier = $routeParams.id;

    /* -----------------------------------
     *  Request data
     * ----------------------------------- */

    // Request user informations from server
    $http.get(server + "/users/user/" + identifier).then(
        function(response) {
            var user = JSON.parse(response.data);

            // Check if user was allowed
            if(user.status) {
                $scope.user = user;
                $scope.loading = false;
            }

            // Redirect if disallow
            else
                $location.path("/error/403");
        },
        function(response) {
            $location.path("/error/" + (
                response.status == -1 ? "503" : response.status));
        }
    );
});
