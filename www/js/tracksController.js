// ***  TRACKLIST Controller

app.controller('TracklistController', function($scope, $rootScope, $state, $location, DataSource, $timeout, $http, filesource) {

    $scope.tracksTitle = "Strecken";


    var gdTracks = [];

    function folderIni() {
        if (!$scope.$parent.folderHistory) {
            $scope.$parent.folderHistory = [{
                id: 'root',
                filename: 'Google Drive'
            }];
        }


    }

    folderIni();
    favoriteIni();

    // *** Ifolder favorite

    function favoriteIni() {
        $scope.gpxerFavorite = JSON.parse(localStorage.getItem("gpxerFavorite"));
        checkFavorite();
    }

    $scope.toggleFavorite = function() {
        if (!$scope.gpxerFavorite) {
            $scope.gdFavorite = true;
            $scope.gpxerFavorite = angular.copy($scope.$parent.folderHistory);
            localStorage.setItem("gpxerFavorite", JSON.stringify($scope.gpxerFavorite));
        } else if ($scope.gpxerFavorite[$scope.gpxerFavorite.length - 1].filename == $scope.$parent.folderHistory[($scope.$parent.folderHistory.length - 1)].filename) {
            $scope.gdFavorite = false;
            $scope.gpxerFavorite = false;
            localStorage.removeItem("gpxerFavorite");
        } else {
            $scope.gdFavorite = true;
            $scope.gpxerFavorite = angular.copy($scope.$parent.folderHistory);
            localStorage.setItem("gpxerFavorite", JSON.stringify($scope.gpxerFavorite));
        }

    }

    function checkFavorite() {
        if ($scope.gpxerFavorite) {
            if ($scope.gpxerFavorite[$scope.gpxerFavorite.length - 1].filename == $scope.$parent.folderHistory[($scope.$parent.folderHistory.length - 1)].filename) {
                $scope.gdFavorite = true;
            } else {
                $scope.gdFavorite = false;
            }
        }

    }

   $scope.loadFavorite =  function() {
        if ($scope.gpxerFavorite) {
            $scope.$parent.folderHistory = angular.copy($scope.gpxerFavorite);
            
            console.log("load:",$scope.$parent.folderHistory[($scope.$parent.folderHistory.length - 1)]);
            $scope.gdLoadTracks($scope.$parent.folderHistory.pop());
        }

    }


    // *** END INI folder favorite


    // ** drawer 
    $scope.showPaperDrawer = function() {
        $scope.$parent.toggleDrawer();
    }
    $scope.hidePaperDrawer = function() {
        $scope.$parent.closeDrawer();
    }

    //  *** focus für search
    $scope.setFocus = function() {
        $scope.tracksSearch = !$scope.tracksSearch;
        $timeout(setFocusWait, 750);
    }

    function setFocusWait() {
        document.getElementById("inputSearch").focus();
    }

    // *** ENDE search

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



    // ** END load track in trackview

    // *** load gpx-list  and provide to scope
    gpxerReadFilelist = function(data, window) {
        var validJSON = JSON.parse(data);
        for (var i = 0; i < validJSON.length; i++) {
            validJSON[i].timestamp = new Date(validJSON[i].filedate);
        }
        $scope.tracks = validJSON;
        $scope.$parent.tracklist = validJSON;

        perfTimer = new Date()
            .getTime() - perfTimer;
    }

    if (!filesource)
        filesource = 'gdrive';

    $scope.fileSource = filesource;

    var perfTimer = new Date()
        .getTime();
    if (filesource == "internal") {
        SOURCE_FILE = "gpx-data/gpxData.json";
        if (!$scope.$parent.tracklist) {
            DataSource.get(SOURCE_FILE, gpxerReadFilelist);
        } else {
            $scope.tracks = $scope.$parent.tracklist;
        }
    } else {
        /*
                $scope.tracks = [{
                    filesize: "",
                    filename: "Keine Dateien gefunden.",
                    filedate: "-"
                }];
        */
        $timeout(checkAuth, 500);

    }




    /**
     * Check if the current user has authorized the application.
     */
    function checkAuth() {
        gapi.auth.authorize({
                'client_id': CLIENT_ID,
                'scope': SCOPES,
                'immediate': true
            },
            handleAuthResult);
    }

    /**
     * Called when authorization server replies.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
            // Access token has been successfully retrieved, requests can be sent to the API.
            gapi.client.load('drive', 'v2', makeDriveRequest);

        } else {
            // No access token could be retrieved, show the button to start the authorization flow.

            gapi.auth.authorize({
                    'client_id': CLIENT_ID,
                    'scope': SCOPES,
                    'immediate': false
                },
                handleAuthResult);

        }
    }

    $scope.gdLoadTracks = function(trackobj) {

        if (trackobj.filesource) {
            if (trackobj.fileextension == "gpx") {
                $scope.$parent.folderHistory.push(trackobj);
                gdDownloadFile(trackobj.fileurl, gdLoadTrack);
            } else {
                $scope.$parent.folderHistory.push(trackobj);
                checkFavorite();
                id = trackobj.id;

                gapi.client.load('drive', 'v2')
                    .then(function() {
                        makeDriveRequest(id);
                    });
            }
        } else {
            $scope.tracksSearch = false;
            $scope.filesQuery = '';
            $state.go('track', {
                'track': trackobj.filename
            });
        }
    }


    function gdLoadTrack(data) {
        $scope.$parent.gdDownloadData = data;

        $state.go('track', {
            'track': 'gdrive'
        });
    }



    /**
     * Download a file's content.
     *
     * @param {File} file Drive File instance.
     * @param {Function} callback Function to call when the request is complete.
     */
    function gdDownloadFile(downloadUrl, callback) {
        if (downloadUrl) {
            var accessToken = gapi.auth.getToken()
                .access_token;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', downloadUrl);
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xhr.onload = function() {
                callback(xhr.responseText);
            };
            xhr.onerror = function() {
                callback(null);
            };
            xhr.send();
        } else {
            callback(null);
        }
    }


    $scope.gdLoadParent = function() {

        $scope.$parent.folderHistory.pop();

        var id = $scope.$parent.folderHistory[($scope.$parent.folderHistory.length - 1)].id;

        checkFavorite();

        gapi.client.load('drive', 'v2')
            .then(function() {
                makeDriveRequest(id);
            });

    }

    function makeDriveRequest(gdId) {

        if (!gdId)
            gdId = $scope.$parent.folderHistory[($scope.$parent.folderHistory.length - 1)].id;

        $scope.curFolder = gdId;

        var request = gapi.client.drive.files.list({
            'corpus': "DOMAIN",
            'maxResults': 500,
            'q': "'" + gdId + "' in parents and trashed=false"

        });

        request.execute(function(resp) {

            gdTracks = [];

            for (i = 0; i < resp.items.length; i++) {
                var gdTitle = resp.items[i].title;
                var gdModDate = new Date(resp.items[i].modifiedDate);
                gdModDate = gdModDate.getDate() + "." + gdModDate.getMonth() + "." + gdModDate.getFullYear() + ", " + gdModDate.getHours() + ":" + gdModDate.getMinutes() + " Uhr";

gdModDate = resp.items[i].modifiedDate;
                var gdFileSize = resp.items[i].fileSize;
                if (gdFileSize)
                    gdFileSize = ", " + Math.round(gdFileSize / 1024) + "Kb";
                var gdMimeType = resp.items[i].mimeType;
                var gdDownloadUrl = resp.items[i].downloadUrl;
                var gdID = resp.items[i].id;
                var gdExtension = resp.items[i].fileExtension + "";


                var fileIcon = "md-place";
                if (gdExtension == "gpx" || gdMimeType == "application/vnd.google-apps.folder") {
                    if (gdMimeType == "application/vnd.google-apps.folder") {
                        fileIcon = 'md-folder';

                    } else {

                    }
                    gdTracks.push({
                        id: gdID,
                        parent: resp.items[i].parents[0].id,
                        fileurl: gdDownloadUrl,
                        filename: gdTitle,
                        fileextension: gdExtension,
                        filedate: gdModDate,
                        filesize: gdFileSize,
                        fileicon: fileIcon,
                        filesource: 'gdrive'
                    });


                }


                //                                                if (gdMimeType == 'application/vnd.google-apps.folder')
                //                                                    fileInfo.style.fontWeight = 'bold';
            }

            $scope.tracks = gdTracks;
            $scope.$apply();


        });
    }








});

// *** ENDE TRACKLIST Controller
