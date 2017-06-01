/* --------------------------------------------------------------------------
 *  Home page
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("home", []);

// Server url
var server = "http://localhost:3000";

/*  Home controller
 *
 *  Manage authenticate with localStorage and cookies usage
 */
app.controller('HomeController',
    function($scope, $window, $http, $location, $auth, $cookies) {

    // Check login status
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    // Manage provider authentification
    $scope.authenticate = function() {
        $auth.link("linkedin").then(function(response) {
            console.info("Successfully connected to LinkedIn");

            var json_data = JSON.parse(response.data);

            $scope.user = json_data.profile;

            // Set authenticate token
            $auth.setToken(json_data.token);

            // Stock id in cookie
            $cookies.put("alinua_user", json_data.profile.id);

            // Store user avatar in localStorage
            if(!json_data.profile.pictureUrl == undefined)
                $window.localStorage.avatar = json_data.profile.pictureUrl;
        })
        .catch(function(response) {
            console.error("Cannot connect session: " + response);
        });
    };

    // Get informations from user if authenticated
    if($auth.isAuthenticated()) {
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
    }
});

/*  Nav controller
 *
 *  Load navigation bar
 */
app.controller('NavController',
    function($scope, $window, $location, $auth, $cookies) {

    // Check login status
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    // Check cookie
    if($scope.avatar == undefined)
        $scope.avatar = $window.localStorage.avatar;

    // Disconnect user session
    $scope.logout = function() {
        $auth.logout().then(function(response) {
            console.info("Successfully disconnect session");

            // Remove stored cookies
            $cookies.remove("alinua_user");

            // Remove stored avatar link
            delete $window.localStorage.avatar;

            // Redirect to home
            $location.path("/");
        })
        .catch(function(response) {
            console.error("Cannot disconnect session: " + response.data);
        });
    };
});
