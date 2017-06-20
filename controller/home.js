/* --------------------------------------------------------------------------
 *  Home page manager
 *
 *  Load website informations and widgets
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("home", []);

// Server url
var server = "http://localhost:3000";

/* --------------------------------------------------------------------------
 *  Alinua controller
 *
 *  Manage login to AlinUA
 * -------------------------------------------------------------------------- */
app.controller('AlinuaController',
    function($auth, $cookies, $http, $interval, $location, $scope, $window) {

    /* -----------------------------------
     *  Variables
     * ----------------------------------- */

    // User informations
    var user = {};
    var unread = 0;
    var message = {};

    // Get cookie content
    var identifier = $cookies.get("alinua_user");

    /* -----------------------------------
     *  Request users
     * ----------------------------------- */

    // Request users list from server
    $http.get(server + "/users").then(
        function(response) {
            $scope.users = [];

            for(user in response.data) {
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

    /* -----------------------------------
     *  Request jobs
     * ----------------------------------- */

    // Request jobs list from server
    $http.get(server + "/jobs").then(
        function(response) {
            $scope.jobs = [];

            for(job in response.data) {
                if(response.data[job].status)
                    $scope.jobs.push(response.data[job]);
            }

            $scope.loading = false;
        },
        function(response) {
            $location.path("/error/" + (
                response.status == -1 ? "503" : response.status));
        }
    );

    /* -----------------------------------
     *  Request projects
     * ----------------------------------- */

    // Request projects list from server
    $http.get(server + "/projects").then(
        function(response) {
            $scope.projects = [];

            for(project in response.data) {
                if(response.data[project].status)
                    $scope.projects.push(response.data[project]);
            }

            $scope.loading = false;
        },
        function(response) {
            $location.path("/error/" + (
                response.status == -1 ? "503" : response.status));
        }
    );

    /* -----------------------------------
     *  Functions
     * ----------------------------------- */

    // Check login status
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    // Manage provider authentification
    $scope.authenticate = function() {
        $auth.link("linkedin").then(function(response) {
            var data = JSON.parse(response.data);

            // Store user informations in localStorage
            $scope.user = data.user;
            $scope.unread = data.unread;
            $scope.messages = data.messages;

            // Debug mode for linkedin api
            $window.localStorage.linkedin_state = "STATE";

            // Set authenticate token
            $auth.setToken(data.token);

            // Stock id in cookie
            $cookies.put("alinua_user", data.user.profile.id);

            // Redirect to home
            $location.path("/");
        })
        .catch(function(response) {
            $location.path("/error/" + (
                response.status == -1 ? "503" : response.status));
        });
    };

    // Manage provider authentification
    $scope.debug = function() {

        // Request user informations from server
        $http.get(server + "/auth/debug").then(
            function(response) {
                var data = JSON.parse(response.data);

                // Store user informations
                $scope.user = data.user;
                $scope.unread = data.unread;
                $scope.messages = data.messages;

                // Debug mode for linkedin api
                $window.localStorage.linkedin_state = "STATE";

                // Set authenticate token
                $auth.setToken(data.token);

                // Stock id in cookie
                $cookies.put("alinua_user", data.user.profile.id);

                // Redirect to home
                $location.path("/");
            },
            function(response) {
                $location.path("/error/" + (
                    response.status == -1 ? "503" : response.status));
            }
        );
    };

    // Disconnect user session
    $scope.logout = function() {
        $auth.logout().then(function(response) {
            // Remove stored cookies
            $cookies.remove("alinua_user");

            // Remove stored user
            delete $scope.user;
            delete $scope.unread;
            delete $scope.messages;
            delete $window.localStorage.linkedin_state;

            // Redirect to home
            $location.path("/");
        })
        .catch(function(response) {
            $location.path("/error/" + (
                response.status == -1 ? "503" : response.status));
        });
    };

    // Request user messages from server
    var refresh = function() {
        // Request user profile
        $http.get(server + "/users/user/" + identifier).then(
            function(response) {
                $scope.user = response.data;

                if(!JSON.parse($scope.user).status)
                    $scope.logout();
            },
            function(response) {
                // Define HTTP status code from response
                var id = (response.status == -1 ? "503" : response.status);

                $location.path("/error/" + id);
            }
        );

        // Request user messages
        $http.get(server + "/inbox/" + identifier).then(
            function(response) {
                var unread = 0;
                var messages = response.data;

                for(message in messages) {
                    if(!messages[message].status)
                        unread += 1;
                }

                $scope.unread = unread;
                $scope.messages = messages;
            },
            function(response) {
                $location.path("/error/" + (
                    response.status == -1 ? "503" : response.status));
            }
        );
    };

    /* -----------------------------------
     *  Request data
     * ----------------------------------- */

    // Get informations from user if authenticated
    if($auth.isAuthenticated()) {
        // Start refresh thread
        $interval(refresh, 60000);
        // Refresh once to get user informations when reloading page
        refresh();
    }
});

/* --------------------------------------------------------------------------
 *  Home controller
 * -------------------------------------------------------------------------- */
app.controller('HomeController', function () {});
