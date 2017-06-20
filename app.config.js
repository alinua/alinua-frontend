/* --------------------------------------------------------------------------
 *  AngularJS application
 *
 *  Configurate application and modules
 * -------------------------------------------------------------------------- */

angular
    .module('alinua', [
        'ngRoute',
        'ngCookies',
        'satellizer',
        'home',
        'job',
        'user',
        'inbox',
        'error',
        'project'
    ])
    .config([
        '$locationProvider',
        '$routeProvider',
        '$authProvider',
        function($locationProvider, $routeProvider, $authProvider) {

            // Avoid HTML5 mode
            $locationProvider.html5Mode(false);
            // Set URL prefix
            $locationProvider.hashPrefix('!');

            /* ---------------------------------------
             *  Helper auth functions
             * ------------------------------------ */

            var skipIfLoggedIn = ['$q', '$auth',
                function($q, $auth) {

                var deferred = $q.defer();

                if ($auth.isAuthenticated())
                    deferred.reject();
                else
                    deferred.resolve();

                return deferred.promise;
            }];

            var loginRequired = ['$q', '$location', '$auth',
                function($q, $location, $auth) {

                var deferred = $q.defer();

                if ($auth.isAuthenticated())
                    deferred.resolve();
                else
                    $location.path('/');

                return deferred.promise;
            }];

            /* ---------------------------------------
             *  Authentification
             * ------------------------------------ */

            // Set LinkedIn provider informations
            $authProvider.linkedin({
                // Server url
                url: 'http://localhost:3000/auth/linkedin',
                // Redirect url
                redirectUri: "http://localhost/alinua/",
                // Application client ID
                clientId: '78ubxg99yuxt6h'
            });

            /* ---------------------------------------
             *  Routes
             * ------------------------------------ */

            // Set route provider informations
            $routeProvider
                .when('/', {
                    templateUrl: 'view/home.html',
                    controller: 'HomeController',
                })
                .when('/about', {
                    templateUrl: 'view/about.html'
                })
                .when('/help', {
                    templateUrl: 'view/help.html'
                })
                .when('/profile', {
                    templateUrl: 'view/user.html',
                    controller: 'UserController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/inbox', {
                    templateUrl: 'view/inbox.html',
                    controller: 'InboxController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/jobs', {
                    templateUrl: 'view/jobs.html',
                    controller: 'JobsController'
                })
                .when('/jobs/new', {
                    templateUrl: 'view/actions/job.html',
                    controller: 'JobEditController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/jobs/edit/:id', {
                    templateUrl: 'view/actions/job.html',
                    controller: 'JobEditController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/jobs/:id', {
                    templateUrl: 'view/job.html',
                    controller: 'JobController'
                })
                .when('/network', {
                    templateUrl: 'view/network.html',
                    controller: 'NetworkController'
                })
                .when('/network/:id', {
                    templateUrl: 'view/user.html',
                    controller: 'UserController'
                })
                .when('/projects', {
                    templateUrl: 'view/projects.html',
                    controller: 'ProjectsController'
                })
                .when('/projects/new', {
                    templateUrl: 'view/actions/project.html',
                    controller: 'ProjectEditController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/projects/edit/:id', {
                    templateUrl: 'view/actions/project.html',
                    controller: 'ProjectEditController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/projects/:id', {
                    templateUrl: 'view/project.html',
                    controller: 'ProjectController'
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
