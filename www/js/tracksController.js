// ***  TRACKLIST Controller

app.controller('TracklistController', function($scope, $rootScope, $state, $location, DataSource, $timeout, $http, fileSource) {

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

        $state.go('track', {
            'track': id
        });

    };

    // ** END load track in trackview

    // *** load gpx-list  and provide to scope
    gpxerReadFilelist = function(data, window) {
        var validJSON = JSON.parse(data);
        for (var i = 0; i < validJSON.length; i++) {
            validJSON[i].timestamp = new Date(validJSON[i].filedate);
        }
        $scope.tracks = validJSON;
        $scope.$parent.tracklist = validJSON;

                perfTimer = new Date().getTime() - perfTimer;
        console.log("time for gpx-data init: " + (perfTimer / 1000) + " seconds.");
    }

    if (!fileSource)
        fileSource = 'internal';

    $scope.fileSource = fileSource;

        var perfTimer = new Date().getTime();
    if (fileSource == "internal") {
        SOURCE_FILE = "gpx-data/gpxData.json";
        if (!$scope.$parent.tracklist) {
            console.log('no scope:');
            DataSource.get(SOURCE_FILE, gpxerReadFilelist);
        }
        else {
            $scope.tracks = $scope.$parent.tracklist;
        }
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

            $scope.togglePaperPopup();
            $scope.filesOrder = sortBy;
            $scope.reverse = !$scope.reverse;
        }
        // *** ENDsort tracks

    // *** popover menu
    $scope.paperOver = false;

    $scope.togglePaperPopup = function() {
        $scope.paperOver = !$scope.paperOver;
        $scope.paperLightbox = !$scope.paperLightbox;
    }


    // *** END popover menu

});

// *** ENDE TRACKLIST Controller
