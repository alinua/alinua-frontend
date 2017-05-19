/* --------------------------------------------------------------------------
 *  Home page
 *
 *  Manage home and sidebar widgets
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("home", []);

// Server url
var server = "http://localhost:3000";

/*  Home controller
 *
 *  Load homepage
 */
app.controller('HomeController',
    function($scope, $window, $rootScope, $location, $auth) {

    // Current page
    $scope.path = "/";

    // Check login status
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    // Manage provider authentification
    $scope.authenticate = function() {
        $auth.link("linkedin").then(function(response) {
            console.info("Successfully connected to LinkedIn");
            console.info(JSON.parse(response.data));

            var json_data = JSON.parse(response.data);

            // Stock profile in localStorage
            $window.localStorage.user = JSON.stringify(json_data.profile);

            $scope.user = json_data.profile;

            // Set authenticate token
            $auth.setToken(json_data.token);
        })
        .catch(function(response) {
            console.info(response.data);
        });
    };

    // Disconnect user session
    $scope.logout = function() {
        $auth.logout().then(function(response) {
            console.info("Successfully disconnect session");

            delete $window.localStorage.user;

            // Redirect to /
            $location.path("/");
        })
        .catch(function(response) {
            console.info(response.data);
        });
    };

    if($auth.isAuthenticated()) {
        $scope.user = JSON.parse($window.localStorage.user);
    }
});

/*  Logout controller
 *
 *  Disconnect current session
 */
app.controller('LogoutController',
    function($scope, $window, $rootScope, $location, $auth) {
    console.info("Logout");

    // Check login status
    if($auth.isAuthenticated()) {
        $auth.logout();

        delete $window.localStorage.user;
    }

    // Redirect to /
    $location.path("/");
});

/*  Sidebar controller
 *
 *  Load sidebar widgets
 */
app.controller('SidebarController',
    function($scope, $http, $routeParams, $location, $auth) {

    // Check login status
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };
});
