// ***  root Controller

app.controller('rootController', function($scope, $state, $location, $ionicPopover) {

    // ** load track in trackview
    $scope.loadTrackList = function(id) {
        $scope.closeDrawer();
        $state.go('tracks', {
            'filesource': id
        });
    }

    $scope.toggleDrawer = function() {
        $scope.paperDrawer = !$scope.paperDrawer;
    }


    $scope.closeDrawer = function() {
        $scope.paperDrawer = false;
    }

    $scope.openDrawer = function() {
        $scope.paperDrawer = true;
    }

});

// *** ENDE root Controller
