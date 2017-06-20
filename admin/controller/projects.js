/* --------------------------------------------------------------------------
 *  Home page
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("projects", []);

// Server url
var server = "http://localhost:3000";

/*  Home controller
 *
 *  Manage authenticate with localStorage and cookies usage
 */
app.controller('ProjectsController',
    function($scope, $window, $http, $location) {

    $scope.show_data = false;

    // Request projects informations from server
    $http.get(server + "/projects").then(
        function(response) {
            $scope.projects = response.data;
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
        var data = {
            "id": id,
            "status": status
        };

        // Request user informations from server
        $http.post(server + "/projects/edit", data).then(
            function(response) {
                for(element in $scope.projects) {
                    if($scope.projects[element].id == id) {
                        $scope.projects[element].status = status;
                        break;
                    }
                }
            },
            function(response) {
                // Define HTTP status code from response
                var id = (response.status == -1 ? "503" : response.status);

                $location.path("/error/" + id);
            }
        );
    };
});
