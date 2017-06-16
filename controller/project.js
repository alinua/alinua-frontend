/* --------------------------------------------------------------------------
 *  Projects manager
 *
 *  Controllers using to manage jobs (informations, listing, ...)
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("project", []);

// Server url
var server = "http://localhost:3000";

/* --------------------------------------------------------------------------
 *  Projects controller
 *
 *  Loading projects list (defautl sorting: date)
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 * -------------------------------------------------------------------------- */
app.controller('ProjectsController',
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
    $http.get(server + "/projects").then(
        function(response) {
            $scope.projects = [];

            for(project in response.data) {
                if(response.data[project].status)
                    $scope.projects.push(response.data[project]);
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
 *  Project controller
 *
 *  Loading project informations
 *
 *  /projects/project/:id
 *      Loading informations from url identifier
 *
 *  Notes
 *  -----
 *  This page need to be authenticated to access
 * -------------------------------------------------------------------------- */
app.controller('ProjectController',
    function($auth, $cookies, $http, $location, $routeParams, $scope) {

    // Check authentification
    if(!$auth.isAuthenticated())
        $location.path('/error/401');

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
    $http.get(server + "/projects/project/" + $routeParams.id).then(
        function(response) {
            $scope.project = response.data;
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
