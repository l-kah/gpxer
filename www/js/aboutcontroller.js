// *** about Controller

app.controller('aboutController', function($scope, $rootScope, $state) {

    $scope.mapLoaded = false;

    $scope.loadPrevious= function() {
        $state.go($state.previous);
    }

});

// *** ENDE about Controller
