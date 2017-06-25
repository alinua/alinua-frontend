/* --------------------------------------------------------------------------
 *  Errors manager
 *
 *  Controller using to manage error informations for user
 * -------------------------------------------------------------------------- */

// Modules
var app = angular.module("error", []);

/* --------------------------------------------------------------------------
 *  Errors controller
 *
 *  Load error informations from his identifier
 *
 *  /error/:id
 *      Loading error message from url identifier
 * -------------------------------------------------------------------------- */
app.controller('ErrorController',
    function($scope, $http, $routeParams) {

    // Errors data structure
    var errors = {
        "401": {
            title: "401 Unauthorized",
            message: "You cannot access to this page without authenticate.",
        },
        "403": {
            title: "403 Forbidden",
            message: "The request was valid, but the server is refusing " +
                "action. The user might not have the necessary permissions " +
                "for a resource.",
        },
        "404": {
            title: "404 Not Found",
            message: "The requested resource could not be found but may " +
                "be available in the future. Subsequent requests by the " +
                "client are permissible.",
        },
        "500": {
            title: "500 Internal Server Error",
            message: "A generic error message, given when an unexpected " +
                "condition was encountered and no more specific message " +
                "is suitable.",
        },
        "501": {
            title: "501 Not Implemented",
            message: "The server either does not recognize the request " +
                "method, or it lacks the ability to fulfill the request. " +
                "Usually this implies future availability (e.g., a new " +
                "feature of a web-service API).",
        },
        "503": {
            title: "503 Service Unavailable",
            message: "The server is currently unavailable (because it is " +
                "overloaded or down for maintenance). Generally, this is a " +
                "temporary state.",
        },
    }

    // Get current error identifier
    var id = (errors[$routeParams.id] == null ? "404" : $routeParams.id);

    // Set informations
    $scope.title = errors[id].title;
    $scope.message = errors[id].message;
});
