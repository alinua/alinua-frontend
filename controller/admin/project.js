/* --------------------------------------------------------------------------
 *  Administration - Job manager
 * -------------------------------------------------------------------------- */

var app = angular.module("admin-project", []);

/*  Edit project  */
app.controller('AdminJobEditController', function(
    $scope, $http, $routeParams, $location) {

    // Request project informations from server
    $http.get("http://localhost:3000/projects/project/" + $routeParams.id).then(
        function(response) {
            $scope.project = JSON.parse(response.data);
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

        // Update project values with children values
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
            $http.post("http://localhost:3000/projects/project/" + $routeParams.id +
                "/edit", data).then(
                function(result) {
                    // Server accept data and update project
                    if(result.data) {
                        // Redirect to project informations page
                        $location.path("/projects/project/" + $routeParams.id);
                    }
                    // Server refuse to update project
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
