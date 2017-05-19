/* --------------------------------------------------------------------------
 *  Administration - User manager
 * -------------------------------------------------------------------------- */

var app = angular.module("admin-user", []);

/*  Edit user  */
app.controller('AdminUserEditController', function(
    $scope, $http, $routeParams, $location) {

    // Request user informations from server
    $http.get("http://localhost:3000/users/user/" + $routeParams.id).then(
        function(response) {
            $scope.user = JSON.parse(response.data);
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

        // Update user values with children values
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
            $http.post("http://localhost:3000/users/user/" + $routeParams.id +
                "/edit", data).then(
                function(result) {
                    // Server accept data and update user
                    if(result.data) {
                        // Redirect to user informations page
                        $location.path("/users/user/" + $routeParams.id);
                    }
                    // Server refuse to update user
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

/*  Register user  */
app.controller('AdminUserRegisterController', function(
    $scope, $http, $routeParams, $location) {

    // Submit request
    $scope.submit = function(form) {
        // Store data from form
        var data = {};
        // Get form children
        var child = form.$$element[0];

        // Update user values with children values
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
            $http.post("http://localhost:3000/register", data).then(
                function(result) {
                    // Server accept data and update user
                    if(result.data.id != -1) {
                        // Redirect to user informations page
                        $location.path("/users/user/" + result.data.id);
                    }
                    // Server refuse to update user
                    else {
                        $location.path("/error/500");
                    }
                },
                function(error) {
                    if(error.status == -1) {
                        $location.path("/error/503");
                    }
                    else {
                        $location.path("/error/" + error.status);
                    }
                }
            );
        }
    }
});
