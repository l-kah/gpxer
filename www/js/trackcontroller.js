// *** TRACKDETAILS Controller

app.controller('TrackController', function($scope, $rootScope, $ionicLoading, $ionicHistory, $state, $location, DataSource, $timeout, track) {


    $scope.showPaperDrawer = function() {
        $scope.$parent.toggleDrawer();
    }




    // ** load tracklist
    $scope.loadTracks = function() {
        $state.go('tracks');
    };


    // ** show tab
    $scope.tabMap = true, $scope.tabList = false;

    $scope.loadTab = function(tabId) {
        console.log('ok');
        $state.go('track.' + tabId);

    };


    // ** END load track in trackview



    // *** load XML and transform gpx

    xmlTransform = function(data, window) {

        var perfTimer = new Date().getTime();


        //        $scope.loading = $ionicLoading.show();

        var x2js = new X2JS();
        var json = x2js.xml_str2json(data);
        var gpxPoints = json.gpx.trk.trkseg.trkpt;

        gpxPoints[0].dist = 0;


        // *** Marker INI
        var labelZlr = 1;
        var labelMax = 2;


        var dTemp = 0;
        var dMaxTemp = 1000; // kilometer marker

        var mz = 1;
        var markers = [];
        var mapGPXlabelBg = '#40C4FF';
        var mapGPXlabelFont = 0;
        var mapGPXlabelFont2 = 4;
        if (dMaxTemp < 1000) {
            mapGPXlabelFont = -4;
            mapGPXlabelFont2 = 6;
        }

        mapGPXlabel = {
            'border': '2px solid #fff',
            'color': 'white',
            'font-weight': '300',
            'font-size': (12 + mapGPXlabelFont) + 'px',
            'line-height': (12 + mapGPXlabelFont) + 'px',
            'text-align': 'center',
            'padding': (mapGPXlabelFont2) + 'px 0 0 0',
            'width': '24px',
            'height': '24px',

            'background-color': mapGPXlabelBg,
            'border-radius': '50%',
            'box-shadow': '1px 3px 3px rgba(0,0,0,.25)',
        };

        mapGPXlabelSmall = {
            'border': '2px solid #fff',
            'width': '10px',
            'height': '10px',
            'background-color': mapGPXlabelBg,
            'border-radius': '50%',
            'box-shadow': '1px 3px 3px rgba(0,0,0,.25)',
            'opacity': 0.75,
        };

        // *** END Marker INI


        var lat1, lat2, lon1, lon2, R = 6371,
            dlat, a, c, d, dTotal = 0;


        var p = 0;


        var maxHeight = minHeight = gpxPoints[0].ele;

        var lonMin, lonMax, latMin, latMax, eleCur;


        // *** zwischenzeiten
        var timeStartTmp = new Date(gpxPoints[0].time),
            timeEndTmp = 0;

        var stepDetails = [];
        // *** END zwischenzeiten



        // *********************
        // *** start loop
        // *********************

        for (p = 0; p < gpxPoints.length; p++) {

            // *** min / max höhe

            eleCur = gpxPoints[p].ele * 1;

            if (eleCur > maxHeight)
                maxHeight = eleCur;

            if (eleCur < minHeight)
                minHeight = eleCur;

            // *** min / max höhe

            if (p > 0) {

                // ** distanz zwischen zwei punkten

                lat1 = gpxPoints[p - 1]._lat * 1;
                lon1 = gpxPoints[p - 1]._lon * 1;
                lat2 = gpxPoints[p]._lat * 1;
                lon2 = gpxPoints[p]._lon * 1;

                R = 6371;
                dLat = (lat2 - lat1) * Math.PI / 180;


                dLon = (lon2 - lon1) * Math.PI / 180;
                dLat1 = (lat1) * Math.PI / 180;
                dLat2 = (lat2) * Math.PI / 180;
                a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                d = R * c;
                dTotal += d; // gesamtdistanz
                gpxPoints[p].dist = dTotal;

                // *** insert marker per KM (= 1000) 
                dTemp += (d * 1000);
                if (dTemp >= dMaxTemp) {

                    if (labelZlr == labelMax) {

                        markers.push({
                            latitude: lat2,
                            longitude: lon2,
                            id: mz,
                            icon: 'images/transparent.png',
                            options: {
                                labelContent: (mz * dMaxTemp) / 1000,
                                labelAnchor: '16 16',
                                labelStyle: mapGPXlabel,
                            },
                        });
                        labelZlr = 1;
                    } else {
                        markers.push({
                            latitude: lat2,
                            longitude: lon2,
                            id: mz,
                            icon: 'images/transparent.png',
                            options: {
                                labelContent: "",
                                labelAnchor: '6 6',
                                labelStyle: mapGPXlabelSmall,
                            },
                        });
                        labelZlr++;
                    }

                    timeEndTmp = new Date(gpxPoints[p].time);
                    timeDiff = timeEndTmp - timeStartTmp;

                    gpxpacetmp = (timeDiff) / (dTemp / 1000);
                    gpxpacetmp = (Math.round(gpxpacetmp * 100) / 100) * 1;


                    gpxspeedtmp = (Math.round((dTemp / 1000) * 100) / 100) / (timeDiff / 1000 / 60 / 60);
                    gpxspeedtmp = Math.round(gpxspeedtmp * 100) / 100;


                    stepDetails.push({
                        pace: new Date(gpxpacetmp),
                        speed: gpxspeedtmp,
                        km: (mz * dMaxTemp) / 1000
                    });

                    timeStartTmp = new Date(gpxPoints[p].time);

                    mz++;
                    dTemp = 0;
                }
                // *** insert marker per KM (= 1000) 

            }
        }

        // *********************
        // *** END start loop
        // *********************




        var eleCur2 = 0;
        var hUp = 0;
        var hDown = 0;

        // *********************
        // *** simplyfied polyline
        // *********************
        var xmlPoints = [],
            xp = 0;

        for (p = 0; p < gpxPoints.length; p = p + 4) {

            xmlPoints[xp] = {
                latitude: gpxPoints[p]._lat * 1,
                longitude: gpxPoints[p]._lon * 1
            }
            if (p == 0) {
                lonMin = xmlPoints[0].longitude;
                lonMax = lonMin;
                latMin = xmlPoints[0].latitude;
                latMax = latMin;
            } else {

                if (xmlPoints[xp].longitude < lonMin)
                    lonMin = xmlPoints[xp].longitude;

                if (xmlPoints[xp].latitude < latMin)
                    latMin = xmlPoints[xp].latitude;

                if (xmlPoints[xp].longitude > lonMax)
                    lonMax = xmlPoints[xp].longitude;
                // breitengrad nord - sued 

                if (xmlPoints[xp].latitude > latMax)
                    latMax = xmlPoints[xp].latitude;


                // *** hoehenmeter
                //  ungenauer, wegen gps schwankungen, nur schlechte annäherung
                eleCur = gpxPoints[xp].ele;
                eleCur2 = gpxPoints[xp - 1].ele;

                if (eleCur > eleCur2)
                    hUp += (eleCur) - (eleCur2);
                else if (eleCur < eleCur2)
                    hDown += (eleCur2) - (eleCur);

                // *** ENDE hoehenmeter
            }

            xp++;

        }

        // *********************
        // *** END simplyfied polyline
        // *********************



        // *** build chartdata höhenmeter

        var chartData = [];
        var phStepDiv = 200; // maximal 200 Punkte im Diagramm
        if (gpxPoints.length < phStepDiv)
            phStepDiv = gpxPoints.length;

        var phStep = Math.floor(gpxPoints.length / phStepDiv);

        //  phStep = 6;
        for (ph = 0; ph < gpxPoints.length; ph += phStep) {

            chartData.push({
                "c": [{
                    "v": Math.round(gpxPoints[ph].dist * 10) / 10 // 2 nachkommastellen
                }, {
                    "v": gpxPoints[ph].ele,
                    "f": gpxPoints[ph].ele + " Meter"
                }]
            });
        }
        // *** END build chartdata



        // *** duration / pace

        var gpxStart = gpxPoints[0].time;
        var gpxEnd = gpxPoints[gpxPoints.length - 1].time;

        var d1 = new Date(gpxStart);
        var d2 = new Date(gpxEnd);
        var miliseconds = d2 - d1;


        var tmpMilliseconds = miliseconds;

        var seconds = miliseconds / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;

        days = tmpMilliseconds / 1000 / 60 / 60 / 24;
        days = Math.floor(days);

        tmpMilliseconds = tmpMilliseconds - (days * 24 * 60 * 60 * 1000);
        hours = tmpMilliseconds / 1000 / 60 / 60;
        hours = Math.floor(hours);

        tmpMilliseconds = tmpMilliseconds - (hours * 60 * 60 * 1000);
        minutes = tmpMilliseconds / 1000 / 60;
        minutes = Math.floor(minutes);

        tmpMilliseconds = tmpMilliseconds - (minutes * 60 * 1000);
        seconds = tmpMilliseconds / 1000;
        seconds = Math.floor(seconds);

        var gpxdur = new Date("Sat Nov 01 2014 " + hours + ":" + minutes + ":" + seconds + " GMT+0100");

        var gpxpace = (miliseconds) / dTotal;
        gpxpace = (Math.round(gpxpace * 100) / 100) * 1;
        gpxpace = new Date(gpxpace);


        var gpxspeed = (Math.round(dTotal * 100) / 100) / (miliseconds / 1000 / 60 / 60);
        gpxspeed = Math.round(gpxspeed * 100) / 100;


        // *** END duration / pace

        // *** prepare details variable

        var gpsHeightDiff = 0; // 48.7

        $scope.gpxMaxHeight = maxHeight - gpsHeightDiff;
        $scope.gpxMinHeight = minHeight - gpsHeightDiff;
        $scope.gpxDistance = Math.round(dTotal * 100) / 100;
        $scope.gpxPace = gpxpace;
        $scope.gpxSpeed = gpxspeed;
        $scope.gpxUp = hUp;
        $scope.gpxDown = hDown;
        $scope.gpxPoints = gpxPoints.length;

        $scope.gpxDuration = gpxdur;

        $scope.gpxStart = gpxPoints[0].time;
        $scope.gpxEnde = gpxPoints[gpxPoints.length - 1].time;

        $scope.gpxMetadata = json.gpx.metadata;


        $scope.gpxPaces = stepDetails;

        // *** END prepare details variable


        // ********************
        // ***  Map INI
        // ********************

        var lonCenter = lonMax - (lonMax - lonMin) / 2;
        var latCenter = latMax - (latMax - latMin) / 2;

        var nesw = {
            northeast: {
                latitude: latMax,
                longitude: lonMax
            },
            southwest: {
                latitude: latMin,
                longitude: lonMin
            }
        };

        $scope.map = {
            center: {
                latitude: latCenter,
                longitude: lonCenter
            },
            zoom: 10,
            bounds: nesw,
            path: xmlPoints,
            stroke: {
                color: '#ff0000',
                weight: 6,
                opacity: 0.5
            },
            fit: true,
            visible: true,
            options: {
                streetViewControl: false,
                tilt: 45,
                zoomControl: false,
                panControl: false
            }

        };


        // ********************
        // ***  END Map INI
        // ********************



        // ********************
        // ***  Distance Markers
        // ********************

        // *** start marker

        mapGPXlabelBg = '#F44336';
        mapGPXlabel = {
            'border': '2px solid #fff',
            'color': 'white',
            'font-weight': '300',
            'font-size': '12px',
            'line-height': '12px',
            'text-align': 'center',
            'padding': '4px 0 0 0',
            'width': '24px',
            'height': '24px',

            'background-color': mapGPXlabelBg,
            'border-radius': '50%',
            'box-shadow': '1px 3px 3px rgba(0,0,0,.25)',
        };

        lat2x = gpxPoints[gpxPoints.length - 1]._lat * 1;
        lon2x = gpxPoints[gpxPoints.length - 1]._lon * 1;
        markers.push({
            latitude: lat2x,
            longitude: lon2x,
            id: mz,
            icon: 'images/transparent.png',
            options: {
                labelContent: 'E',
                labelAnchor: '16 16',
                labelStyle: mapGPXlabel,
            },

        });
        mz++;

        // *** end marker

        mapGPXlabelBg = '#4CAF50';
        mapGPXlabel = {
            'border': '2px solid #fff',
            'color': 'white',
            'font-weight': '300',
            'font-size': '12px',
            'line-height': '12px',
            'text-align': 'center',
            'padding': '4px 0 0 0',
            'width': '24px',
            'height': '24px',

            'background-color': mapGPXlabelBg,
            'border-radius': '50%',
            'box-shadow': '1px 3px 3px rgba(0,0,0,.25)',
        };


        lat2x = gpxPoints[0]._lat * 1;
        lon2x = gpxPoints[0]._lon * 1;

        markers.push({
            latitude: lat2x,
            longitude: lon2x,
            id: mz,
            icon: 'images/transparent.png',
            options: {
                labelContent: 'S',
                labelAnchor: '16 16',
                labelStyle: mapGPXlabel,
            },

        });
        mz++;

        $scope.markersDiststeps = markers;

        // ********************
        // *** END Distance Markers
        // ********************



        // ********************
        // *** charts
        // ********************


        $scope.chartObject = {
            "type": "LineChart",
            "displayed": true,
            "data": {
                "cols": [{
                        "id": "km",
                        "label": "Distanz",
                        "type": "string",
                        "p": {}
                    }, {
                        "id": "hm-id",
                        "label": "Höhenmeter",
                        "type": "number",
                        "p": {}
                    },

                ],
                "rows": chartData
                    // zeit


            },
            "options": {
                "title": "",
                "isStacked": "true",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    textStyle: {
                        fontSize: 12
                    },

                    "title": "Höhe",
                    titleTextStyle: {
                        color: '#757575'
                    },
                    "gridlines": {
                        "count": 5,
                        color: '#E0E0E0',
                    },

                },
                "hAxis": {
                    textStyle: {
                        fontSize: 10
                    },
                    "title": "Distanz",
                    titleTextStyle: {
                        color: '#757575',
                    },
                    baselineColor: '#e0e0e0',
                    showTextEvery: 15,

                },

                height: 250,
                lineWidth: 2,
                axisTitlesPosition: 'out',
                chartArea: {
                    left: '15%',
                    top: '15%',
                    width: '80%',
                    height: '60%'
                },
                legend: {
                    position: 'none'
                },
                colors: ['#FF5722'],
            },
        }

        $scope.cssStyle = "";


        // ********************
        // *** END charts
        // ********************

        $scope.mapLoaded = true;

        perfTimer = new Date().getTime() - perfTimer;
        console.log("time for gpx-data init: " + (perfTimer / 1000) + " seconds.");

    };

    // *********************
    // *** END map full ini
    // *********************

    // *** load XML and call transform gpx
    // var SOURCE_FILE = "gpx-data/runtastic_20140309_1641_Wandern.gpx";

    if (!track)
        $scope.curTrackfile = "runtastic_20150103_1707_Laufen.gpx";
    else
        $scope.curTrackfile = track;


    // *** load XML and call transform gpx
    // var SOURCE_FILE = "gpx-data/runtastic_20140309_1641_Wandern.gpx";


    $timeout(saveMapData, 1000);



    function saveMapData() {

        $scope.mapLatCenter = $scope.map.center.latitude;
        $scope.mapLongCenter = $scope.map.center.longitude;

        //        mapBounds = $scope.map.bounds;

        $scope.marker = {};
        $scope.marker.id = 0;

        // $ionicLoading.hide();

    }


    var SOURCE_FILE = "gpx-data/" + $scope.curTrackfile;
    DataSource.get(SOURCE_FILE, xmlTransform);

    // *** END load XML and call transform gpx



});

// *** ENDE TRACKDETAILS Controller
