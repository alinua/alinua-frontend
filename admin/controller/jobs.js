/* --------------------------------------------------------------------------
 *  Home page
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("jobs", []);

// Server url
var server = "http://localhost:3000";

/*  Home controller
 *
 *  Manage authenticate with localStorage and cookies usage
 */
app.controller('JobsController',
    function($scope, $window, $http, $location, $route) {

    $scope.show_data = false;

    // Request jobs informations from server
    $http.get(server + "/jobs").then(
        function(response) {
            $scope.jobs = response.data;
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

        // Join tags values with spaces
        $scope.data.description.tags = $scope.data.description.tags.join(' ');
    };

    $scope.onChangeStatus = function(id, status) {
        var data = {
            "id": id,
            "status": status
        };

        // Request user informations from server
        $http.post(server + "/jobs/edit", data).then(
            function(response) {
                for(element in $scope.jobs) {
                    if($scope.jobs[element].id == id) {
                        $scope.jobs[element].status = status;
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

    $scope.onDelete = function(identifier) {
        if(confirm("Voulez-vous vraiment supprimer cette annonce ?")) {

            data = {
                id: identifier
            };

            // Send a submit request to server
            $http.post("http://localhost:3000/jobs/delete", data).then(
                function(result) {
                    // Server accept data and remove project
                    if(result.data)
                        $route.reload();

                    // Server refuse to update project
                    else
                        $location.path("/error/500");
                },
                function(error) {
                    console.error(error);
                }
            );
        }
    };
});
