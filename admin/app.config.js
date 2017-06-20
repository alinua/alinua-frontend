/* --------------------------------------------------------------------------
 *  AngularJS application
 *
 *  Configurate application and modules
 * -------------------------------------------------------------------------- */

angular
    .module('adminua', [
        'ngRoute',
        'main',
        'jobs',
        'users',
        'error',
        'projects'
    ])
    .config([
        '$locationProvider',
        '$routeProvider',
        function($locationProvider, $routeProvider) {

            // Avoid HTML5 mode
            $locationProvider.html5Mode(false);
            // Set URL prefix
            $locationProvider.hashPrefix('!');

            /* ---------------------------------------
             *  Routes
             * ------------------------------------ */

            // Set route provider informations
            $routeProvider
                .when('/', {
                    templateUrl: 'view/main.html',
                    controller: 'MainController',
                })
                .when('/jobs', {
                    templateUrl: 'view/jobs.html',
                    controller: 'JobsController',
                })
                .when('/users', {
                    templateUrl: 'view/users.html',
                    controller: 'UsersController',
                })
                .when('/projects', {
                    templateUrl: 'view/projects.html',
                    controller: 'ProjectsController',
                })
                .when('/error/:id', {
                    templateUrl: 'view/error.html',
                    controller: 'ErrorController',
                })
                .otherwise({
                    redirectTo: '/error/404',
                });
        }
    ]);
