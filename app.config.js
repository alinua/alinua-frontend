/* --------------------------------------------------------------------------
 *  AngularJS application
 *
 *  Configurate application and modules
 * -------------------------------------------------------------------------- */

angular
    .module('alinua', [
        'ngRoute',
        'satellizer',
        'home',
        'error',
        'job',
        'user',
        'admin-job',
        'admin-user',
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

                if ($auth.isAuthenticated()) {
                    deferred.reject();
                }
                else {
                    deferred.resolve();
                }

                return deferred.promise;
            }];

            var loginRequired = ['$q', '$location', '$auth',
                function($q, $location, $auth) {

                var deferred = $q.defer();

                if ($auth.isAuthenticated()) {
                    deferred.resolve();
                }
                else {
                    $location.path('/');
                }

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
                .when('/logout', {
                    controller: 'LogoutController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/profile', {
                    templateUrl: 'view/user.html',
                    controller: 'ProfileController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/jobs', {
                    templateUrl: 'view/jobs.html',
                    controller: 'JobsController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/jobs/job/:id', {
                    templateUrl: 'view/job.html',
                    controller: 'JobController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/network', {
                    templateUrl: 'view/network.html',
                    controller: 'UsersController',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/network/user/:id', {
                    templateUrl: 'view/user.html',
                    controller: 'UserController',
                    resolve: {
                        loginRequired: loginRequired
                    }
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