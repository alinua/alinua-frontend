/* --------------------------------------------------------------------------
 *  Administration - Job manager
 * -------------------------------------------------------------------------- */

var app = angular.module("admin-job", []);

/*  Edit job  */
app.controller('AdminJobEditController', function(
    $scope, $http, $routeParams, $location) {

    // Request job informations from server
    $http.get("http://localhost:3000/jobs/job/" + $routeParams.id).then(
        function(response) {
            $scope.job = JSON.parse(response.data);
        },
        function(response) {
            console.error("Cannot fetch data from server");

            var id = (response.status == -1 ? "503" : response.status)
            $location.path("/error/" + id);
        }
    );

    // Submit request
    $scope.submit = function(form) {
        // Store data from form
        var data = {};
        // Get form children
        var child = form.$$element[0];

        // Update job values with children values
        for (var i = 0; i < child.length; i++) {
            var name = child[i].name;

            // Only accept input with name
            if(name != undefined && name.length > 0) {
                data[name] = child[i].value;
            }
        }

        // Form is valid
        if(form.$valid) {
            // Send a submit request to server
            $http.post("http://localhost:3000/jobs/job/" + $routeParams.id +
                "/edit", data).then(
                function(result) {
                    // Server accept data and update job
                    if(result.data) {
                        // Redirect to job informations page
                        $location.path("/jobs/job/" + $routeParams.id);
                    }
                    // Server refuse to update job
                    else {
                        $location.path("/error/500");
                    }
                },
                function(error) {
                    console.error(error);
                }
            );
        }
    }
});
