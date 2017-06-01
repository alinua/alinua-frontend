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
    function($scope, $window, $http, $location) {

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
    };

    $scope.onChangeStatus = function(id, status) {
        // Request user informations from server
        $http.get(server + "/jobs/job/" + id + "/status/" + status).then(
            function(response) {
                $scope.jobs[id].status = status;

                $window.location.reload();
            },
            function(response) {
                // Define HTTP status code from response
                var id = (response.status == -1 ? "503" : response.status);

                $location.path("/error/" + id);
            }
        );
    };
});
