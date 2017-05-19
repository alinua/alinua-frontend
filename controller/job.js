/* --------------------------------------------------------------------------
 *  Jobs manager
 *
 *  Controllers using to manage jobs (informations, listing, ...)
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("job", []);

// Server url
var server = "http://localhost:3000";

/*  Job controller
 *
 *  Load job informations from his identifier
 *
 *  Parameters
 *  ----------
 *  id : int
 *      User identifier
 *
 *  Notes
 *  -----
 *  Fetch data from /jobs/job/<id>
 */
app.controller('JobController',
    function($scope, $http, $routeParams, $auth) {

    // Variables
    $scope.loading = true;

    // Check authentification
    if(!$auth.isAuthenticated()) {
        $location.path("/error/403");
    }

    // Request job informations from server
    $http.get(server + "/jobs/job/" + $routeParams.id).then(
        function(response) {
            console.debug("Received data from server with success");

            // Parse fetch data
            $scope.job = JSON.parse(response.data);

            // Terminate loading
            $scope.loading = false;
        },
        function(response) {
            console.error("Cannot fetch data from server");

            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            // Redirect to /error/<id>
            $location.path("/error/" + id);
        }
    );
});

/*  Jobs controller
 *
 *  Load jobs list sorted by published date
 *
 *  Notes
 *  -----
 *  Fetch data from /jobs
 */
app.controller('JobsController',
    function($scope, $http, $routeParams, $location, $auth) {

    // Variables
    $scope.loading = true;
    $scope.reverse = true;
    $scope.order = "published";

    // Check authentification
    if(!$auth.isAuthenticated()) {
        $location.path("/error/403");
    }

    // Request jobs list from server
    $http.get(server + "/jobs").then(
        function(response) {
            console.debug("Received data from server with success");

            // Parse fetch data
            $scope.jobs = JSON.parse(response.data);

            // Terminate loading
            $scope.loading = false;
        },
        function(response) {
            console.error("Cannot fetch data from server");

            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            // Redirect to /error/<id>
            $location.path("/error/" + id);
        }
    );
});
