// ***  TRACKLIST Controller

app.controller('TracklistController', function($scope, $rootScope, $state, $location, $ionicHistory, DataSource, $timeout, $http, $ionicPopover, fileSource) {

// ** drawer 
    $scope.showPaperDrawer = function() {
        $scope.$parent.toggleDrawer();
    }
    $scope.hidePaperDrawer = function() {
        $scope.$parent.closeDrawer();
    }



    // *** ENDE search


    // ** load track in trackview
    $scope.loadTrack = function(id) {

        $scope.tracksSearch = false;
        $scope.filesQuery = '';

        $state.go('track.map', {
            'track': id
        });

    };

    // ** END load track in trackview

    // *** load gpx-list  and provide to scope
    gpxerReadFilelist = function(data, window) {
        var validJSON = JSON.parse(data);


        for (var i = 0; i < validJSON.gpxFiles.length; i++) {
            validJSON.gpxFiles[i].timestamp = new Date(validJSON.gpxFiles[i].filedate);
        }

        $scope.tracks = validJSON.gpxFiles;

    }

    if (!fileSource)
        fileSource = 'internal';

    $scope.fileSource = fileSource;


    if (fileSource == "internal") {
        SOURCE_FILE = "gpx-data/gpxData.json";
        DataSource.get(SOURCE_FILE, gpxerReadFilelist);
    } else {
        $scope.tracks = [{
            filesize: "",
            filename: "Keine Dateien gefunden.",
            filedate: "-"
        }];
    }

    $scope.filesOrder = "filedate";

    // *** sort tracks
    $scope.sortTracks = function(sortBy) {

            $scope.popover.hide();
            $scope.filesOrder = sortBy;
            $scope.reverse = !$scope.reverse;
        }
        // *** ENDsort tracks

    // *** popover menu
    $ionicPopover.fromTemplateUrl('tracks-menu.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });

    // *** END popover menu

});

// *** ENDE TRACKLIST Controller

