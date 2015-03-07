// ***  root Controller

app.controller('rootController', function($scope, $state, $location) {


    // ** load track in trackview
    $scope.loadTrackList = function(id) {
        $scope.closeDrawer();
        $scope.gdCurrentDir = "";
        $state.go('tracks', {
            'filesource': id
        });

    }

    $scope.loadAbout = function() {
        $scope.closeDrawer();
        $state.go('about');
    }

    $scope.loadSettings = function() {
        $scope.closeDrawer();
        $state.go('settings');
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

    $scope.parentscope = true;

});

// *** ENDE root Controller
