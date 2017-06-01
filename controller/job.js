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
 *  This page need to be authenticated to access
 */
app.controller('JobController',
    function($scope, $http, $routeParams, $location, $auth, $cookies) {

    // Check authentification
    if(!$auth.isAuthenticated()) {
        $location.path('/error/401');
    }

    // Get user id from cookie
    var id = $cookies.get("alinua_user");

    // Request job informations from server
    $http.get(server + "/jobs/job/" + $routeParams.id).then(
        function(response) {
            $scope.job = response.data;

            $scope.owner = false;
            if(response.data.user.id === id)
                $scope.owner = true;
        },
        function(response) {
            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            $location.path("/error/" + id);
        }
    );

    // User click on postulate button
    $scope.onPostulate = function() {
    };
});

/*  Jobs controller
 *
 *  Load jobs list sorted by published date
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 */
app.controller('JobsController',
    function($scope, $http, $location, $auth) {

    // Variables
    $scope.reverse = true;
    $scope.order = "date";

    // Check authentification
    if(!$auth.isAuthenticated()) {
        $location.path('/error/401');
    }

    // Request jobs list from server
    $http.get(server + "/jobs").then(
        function(response) {
            $scope.jobs = [];

            for(job in response.data) {
                if(response.data[job].status)
                    $scope.jobs.push(response.data[job]);
            }
        },
        function(response) {
            // Define HTTP status code from response
            var id = (response.status == -1 ? "503" : response.status);

            $location.path("/error/" + id);
        }
    );
});
