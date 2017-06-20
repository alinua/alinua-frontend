/* --------------------------------------------------------------------------
 *  Home page
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("users", []);

// Server url
var server = "http://localhost:3000";

/*  Home controller
 *
 *  Manage authenticate with localStorage and cookies usage
 */
app.controller('UsersController',
    function($scope, $window, $http, $location) {

    $scope.show_data = false;

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

    $scope.show = function(data) {
        if($scope.data == data)
            $scope.show_data = !$scope.show_data;
        else
            $scope.show_data = true;

        $scope.data = data;
    };

    $scope.onChangeStatus = function(id, status) {

        var user = undefined;

        for(element in $scope.users) {
            if($scope.users[element].profile.id == id) {
                user = element;
                break;
            }
        }

        if(user != undefined) {
            var data = {
                "id": $scope.users[user].profile.id,
                "status": status
            };

            // Request user informations from server
            $http.post(server + "/users/edit", data).then(
                function(response) {
                    $scope.users[user].status = status;
                },
                function(response) {
                    // Define HTTP status code from response
                    var id = (response.status == -1 ? "503" : response.status);

                    $location.path("/error/" + id);
                }
            );
        }
    };
});
