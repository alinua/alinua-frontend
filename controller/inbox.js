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
    function($auth, $cookies, $http, $location, $scope, $route) {

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

    // Show item content
    $scope.show = function(message) {
        $scope.message_data = message;
    };

    // Change item status
    $scope.mark = function(message) {
        // Request user informations from server
        $http.get(server + "/inbox/status/" + identifier + "/" + message.id).then(
            function(response) {
                for(element in $scope.messages) {
                    if($scope.messages[element].id == message.id) {
                        $scope.messages[element].status = response.data.status;
                        break;
                    }
                }

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

    // Delete an item
    $scope.onDelete = function(identifier) {
        if(confirm("Voulez-vous vraiment supprimer ce message ?")) {

            data = {
                id: identifier
            };

            // Send a submit request to server
            $http.post("http://localhost:3000/inbox/delete", data).then(
                function(result) {
                    // Server accept data and remove message
                    if(result.data) {
                        $route.reload();
                    }

                    // Server refuse to remove message
                    else
                        $location.path("/error/500");
                },
                function(error) {
                    console.error(error);
                }
            );
        }
    };

    /* -----------------------------------
     *  Request data
     * ----------------------------------- */

    $http.get(server + "/inbox/" + identifier).then(
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
