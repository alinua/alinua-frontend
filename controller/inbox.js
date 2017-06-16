/* --------------------------------------------------------------------------
 *  Users manager
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("inbox", []);

// Server url
var server = "http://localhost:3000";

/* --------------------------------------------------------------------------
 *  Inbox controller
 *
 *  Loading user messages
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 * -------------------------------------------------------------------------- */
app.controller('InboxController',
    function($auth, $cookies, $http, $location, $scope) {

    // Check login status
    if(!$auth.isAuthenticated())
        $location.path('/error/401');

    /* -----------------------------------
     *  Variables
     * ----------------------------------- */

    $scope.loading = true;

    // Get cookie content
    var identifier = $cookies.get("alinua_user");

    /* -----------------------------------
     *  Functions
     * ----------------------------------- */

    // Show message content when user click on title
    $scope.show = function(message) {
        $scope.message_data = message;
    };

    // CHange message status when user click on icon
    $scope.mark = function(message) {
        // Request user informations from server
        $http.get(server + "/inbox/user/" + identifier + "/" + message.id + "/status").then(
            function(response) {
                $scope.messages[message.id].status = response.data.status;

                // Update navigation bar
                if(response.data.status)
                    $scope.$parent.unread -= 1;
                else
                    $scope.$parent.unread += 1;
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

    $http.get(server + "/inbox/user/" + identifier).then(
        function(response) {
            $scope.messages = response.data;

            $scope.unread = 0;
            for(message in response.data) {
                if(!$scope.messages[message].status)
                    $scope.unread += 1;
            }

            $scope.loading = false;
        },
        function(response) {
            $location.path("/error/" + (
                response.status == -1 ? "503" : response.status));
        }
    );
});



