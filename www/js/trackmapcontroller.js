// *** TRACKDETAILS Controller

app.controller('TrackMapController', function($scope, $ionicLoading, $interval, $ionicHistory, $state, $location, DataSource, $timeout, track) {

    $scope.mapLoaded = false;


    $scope.mapBounds = function() {

        $scope.map.center.latitude = $scope.mapLatCenter;
        $scope.map.center.longitude = $scope.mapLongCenter;

        $scope.map.bounds = $scope.mapPolyBounds;
        $scope.map.zoom = $scope.mapZoom;

    }

    // ***  END init google maps

    // *** ini gps marker

    var mapGPSlabel = {
        'background-image': 'url("images/pin.png"',
        'background-size': '24px 24px',
        'background-position': 'top left',
        'background-repeat': 'no-repeat',
        'border': '2px solid #fff',
        'color': 'white',
        'font-weight': '300',
        'font-size': '12px',
        'line-height': '12px',
        'text-align': 'center',
        'padding': '4px 0 0 0',
        'width': '16px',
        'height': '16px',

        'background-color': '#F44336',
        'border-radius': '50%',
        'box-shadow': '1px 3px 3px rgba(0,0,0,.25)',
        'opacity': '0.75'
    };

    // *** END ini gps marker

    // *** gps location call

    var gpsInterval;

    $scope.gpsLock = false;

    $scope.toggleGPS = function() {
        $scope.gpsLock = !$scope.gpsLock;
        if ($scope.gpsLock == true) {
            gpsInterval = $interval($scope.centerOnMe, 1000);
            $scope.centerOnMe();
        } else {
            $interval.cancel(gpsInterval);
        }
    }


    $scope.centerOnMe = function() {

        if (!$scope.map) {
            return;
        }

        var options = {
            enableHighAccuracy: true,
            timeout: 50000,
            maximumAge: 0
        };
        //        $scope.loading = $ionicLoading.show();
        navigator.geolocation.getCurrentPosition(function(pos) {

                // center map
                $scope.map.center.latitude = pos.coords.latitude;
                $scope.map.center.longitude = pos.coords.longitude;
                $scope.map.zoom = 16;

                // set marker

                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    },
                    options: {
                        draggable: false,
                        visible: true,
                        icon: {

                            size: {
                                width: 24,
                                height: 24
                            },
                            url: 'images/ic_place_custom_48dp.png'
                        },
                        icon: 'images/transparent.png',
                        labelContent: '',
                        labelAnchor: '6 22',
                        labelStyle: mapGPSlabel,

                    }
                };
                $scope.$apply;

                //                $ionicLoading.hide();
            },
            function(error) {
                console.log('Unable to get location: ' + error.message);
            }, options);

    };


    // *** END gps location call

});

// *** ENDE TRACKDETAILS Controller
