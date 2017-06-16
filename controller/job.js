/* --------------------------------------------------------------------------
 *  Jobs manager
 *
 *  Controllers using to manage jobs (informations, listing, ...)
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("job", []);

// Server url
var server = "http://localhost:3000";

/* --------------------------------------------------------------------------
 *  Jobs controller
 *
 *  Loading jobs list (defautl sorting: date)
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 * -------------------------------------------------------------------------- */
app.controller('JobsController',
    function($auth, $http, $location, $scope) {

    /* -----------------------------------
     *  Variables
     * ----------------------------------- */

    $scope.loading = true;

    $scope.reverse = true;
    $scope.order = "date";

    /* -----------------------------------
     *  Request data
     * ----------------------------------- */

    // Request jobs list from server
    $http.get(server + "/jobs").then(
        function(response) {
            $scope.jobs = [];

            for(job in response.data) {
                if(response.data[job].status)
                    $scope.jobs.push(response.data[job]);
            }

            $scope.loading = false;
        },
        function(response) {
            $location.path("/error/" + (
                response.status == -1 ? "503" : response.status));
        }
    );
});

/* --------------------------------------------------------------------------
 *  Job controller
 *
 *  Loading job informations
 *
 *  /jobs/job/:id
 *      Loading informations from url identifier
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 * -------------------------------------------------------------------------- */
app.controller('JobController',
    function($auth, $cookies, $http, $location, $routeParams, $scope) {

    /* -----------------------------------
     *  Variables
     * ----------------------------------- */

    $scope.loading = true;

    // Get cookie content
    // var identifier = $cookies.get("alinua_user");

    /* -----------------------------------
     *  Request data
     * ----------------------------------- */

    // Request job informations from server
    $http.get(server + "/jobs/job/" + $routeParams.id).then(
        function(response) {
            $scope.job = response.data;
            $scope.loading = false;

            $scope.owner = false;
            // if(response.data.user.profile.id === identifier)
                // $scope.owner = true;
        },
        function(response) {
            $location.path("/error/" + (
                response.status == -1 ? "503" : response.status));
        }
    );
});

/* --------------------------------------------------------------------------
 *  Job modification controller
 *
 *  Edit job informations
 *
 *  /jobs/edit
 *      Edit or create a job
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 * -------------------------------------------------------------------------- */
app.controller('JobEditController',
    function($auth, $cookies, $http, $location, $routeParams, $scope) {

    // Check login status
    if(!$auth.isAuthenticated())
        $location.path('/error/401');

    /* -----------------------------------
     *  Variables
     * ----------------------------------- */

    console.debug($scope);

    // Get cookie content
    // var identifier = $cookies.get("alinua_user");

    /* -----------------------------------
     *  Form
     * ----------------------------------- */

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
