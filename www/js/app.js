// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('GPXerApp', ['ionic', 'ngTouch', 'uiGmapgoogle-maps', 'GPXerApp.service', 'googlechart']);

app.run(function($ionicPlatform, $rootScope, $location, $state) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        $state.previous = fromState;
    });

})

app.config(function($ionicConfigProvider) {
    // $ionicConfigProvider.views.maxCache(5);
    // note that you can also chain configs

});



app.config(function($compileProvider) {
    // Set the whitelist for certain URLs just to be safe
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})


app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('tracks/internal');


    $stateProvider.state('tracks', {
        url: '/tracks/:filesource',
        templateUrl: 'partials/tracks.html',
        controller: 'TracklistController',
        resolve: {
            fileSource: function($stateParams) {
                return $stateParams.filesource
            }
        }

    })

    $stateProvider.state('track', {
        url: '/tracks/:track',
        templateUrl: 'partials/track.html',
        controller: 'TrackController',
        resolve: {
            track: function($stateParams) {
                return $stateParams.track
            }
        }
    })

    $stateProvider.state('track.map', {
        url: '/map',
        templateUrl: 'partials/track-map.html',
        controller: 'TrackMapController',



    })

    $stateProvider.state('track.infos', {
        url: '/infos',
        templateUrl: 'partials/track-infos.html',

    })


    $stateProvider.state('about', {
        url: '/about',
        templateUrl: 'partials/about.html',
        controller: 'aboutController',

    })

    $stateProvider.state('settings', {
        url: '/settings',
        templateUrl: 'partials/settings.html',
        controller: 'aboutController',

    })

});


// *** loader

app.constant('$ionicLoadingConfig', {
    templateUrl: 'partials/helperSpinner.html',
    showBackdrop: false,
    noBackdrop: false
});

// *** load file


angular.module('GPXerApp.service', []).
factory('DataSource', ['$http', function($http) {
    return {
        get: function(file, callback, transform) {
            $http.get(
                file, {
                    transformResponse: transform
                }
            ).
            success(function(data, status) {
                //                    console.log("Request succeeded");
                callback(data);
            }).
            error(function(data, status) {
                console.log("Request failed " + status);
            });
        }
    };
}]);
