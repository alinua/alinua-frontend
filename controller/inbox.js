/* --------------------------------------------------------------------------
 *  Users manager
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("inbox", []);

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
app.controller('InboxController',
    function($scope, $route, $http, $location, $auth, $cookies) {

    // Check login status
    if(!$auth.isAuthenticated()) {
        $location.path('/error/401');
    }

    // Get user id from cookie
    var id = $cookies.get("alinua_user");

    $scope.show_message = false;

    // Request user informations from server
    $http.get(server + "/inbox/user/" + id).then(
        function(response) {
            $scope.messages = response.data;
        },
        function(response) {
            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            $location.path("/error/" + id);
        }
    );

    $scope.show = function(message) {
        $scope.show_message = true;
        $scope.message_data = message;
    };

    $scope.mark = function(message) {
        // Request user informations from server
        $http.get(server + "/inbox/user/" + id + "/" + message.id + "/status").then(
            function(response) {
                $scope.messages[message.id].status = response.data.status;

                $route.reload();
            },
            function(response) {
                // Define HTTP status code from response
                var id = (response.status == -1 ? "503" : response.status);

                $location.path("/error/" + id);
            }
        );
    };
});



