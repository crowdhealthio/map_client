// Provide your access token

$(document).ready(function() {
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2hlbGRvbmxpbmUiLCJhIjoiRVRIYlNIYyJ9.3hMiE63z6mxyBBPe1-mxiQ';


    var map = L.mapbox.map('map', 'sheldonline.ca9ee452', {
        zoomControl: false,
        maxZoom: 20,
        minZoom: 13
    });

    var currentLocation;

    new L.Control.Zoom({
        position: 'topright'
    }).addTo(map);

    var myLayer = L.mapbox.featureLayer().addTo(map);

    var featureLayers = [];

    window.onload = function(e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();
    }

    map.on('locationfound', function(e) {
        map.fitBounds(e.bounds);
        map.setZoom(14);

        currentLocation = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [e.latlng.lng, e.latlng.lat]
            },
            properties: {
                'title': 'Current location',
                'marker-color': '#ff8888',
                'marker-symbol': 'star'
            }
        };

        myLayer.setGeoJSON(currentLocation);

        findFeaturesAroundCoordinate(e.latlng.lng, e.latlng.lat, map.getZoom());
        // And hide the geolocation button
    });

    window.routeTo = function(feature) {
        console.log("here");
        $.getJSON("https://www.mapbox.com/developers/api/directions/mapbox.walking/" + currentLocation.geometry.coordinates[0] + "," + currentLocation.geometry.coordinates[1] + ";" + feature.geometry.coordinates[0] + "," + feature.geometry.coordinates[1] + ".json/?access_token=pk.eyJ1Ijoic2hlbGRvbmxpbmUiLCJhIjoiRVRIYlNIYyJ9.3hMiE63z6mxyBBPe1-mxiQ", function(response) {
            console.log(response);
        });
    };

    map.on("zoomend", function(e) {
        var latlng = map.getCenter();
        findFeaturesAroundCoordinate(latlng.lng, latlng.lat, map.getZoom());
    });

    var typesLoaded = false;

    var zoomLevelToRadius = function(zoomLevel) {
        return Math.exp(80 / zoomLevel) / zoomLevel;
    }

    var findFeaturesAroundCoordinate = function(lng, lat, zoomLevel) {
        $.getJSON("http://crowdhealth.herokuapp.com/api/v1/types", function(types) {
            $(types).each(function(index, type) {
                $.getJSON("http://crowdhealth.herokuapp.com/api/v1/types/" + type.id + "/artifacts/?lat=" + lat + "&lng=" + lng + "&distance=" + zoomLevelToRadius(zoomLevel), function(data) {
                    var featureLayer;
                    console.log(featureLayers);
                    console.log(typesLoaded);
                    if (typesLoaded) {
                        for (var i = featureLayers.length - 1; i >= 0; i--) {
                            if (featureLayers[i].type === type.name) {
                                featureLayer = featureLayers[i];
                            }
                        };
                    } else {
                        featureLayer = L.mapbox.featureLayer();
                        featureLayer.type = type.name;
                        featureLayers.push(featureLayer);
                    }

                    for (var i = 0; i < data.features.length; i++) {
                        var feature = data.features[i];
                        var properties = feature.properties;
                        properties.icon = {
                            "iconUrl": "img/" + type.name + ".png",
                            "iconSize": [30, 38.51],
                            "iconAnchor": [15, 38.51],
                            "popupAnchor": [0, -38.51],
                            "className": "dot"
                        }
                        properties.description += "\u003cbr\u003e \u003ca  data-lat=\"" + feature.geometry.coordinates[1] + "\" data-lng=\"" + feature.geometry.coordinates[0] + "\" class=\"button small\" \u003e Get me here  \u003c/button\u003e"
                    };

                    if (!typesLoaded) {
                        // Set a custom icon on each marker based on feature properties.
                        featureLayer.on('layeradd', function(e) {
                            var marker = e.layer,
                                feature = marker.feature;
                            marker.setIcon(L.icon(feature.properties.icon));
                        });
                        addLayer(featureLayer, type.name, index + 2);
                    }
                    if (featureLayer) {
                        featureLayer.setGeoJSON(data);
                    }
                    if (!typesLoaded) {
                        typesLoaded = types.length - 1 === index;
                    }
                })
            });
        });
    };

    var geocoder = L.mapbox.geocoder('mapbox.places');

    function showMap(err, data) {
        // The geocoder can return an area, like a city, or a
        // point, like an address. Here we handle both cases,
        // by fitting the map bounds to an area or zooming to a point.
        if (!map) {
            map = L.mapbox.map('map', 'examples.map-h67hf2ic');
        }

        if (data.lbounds) {
            map.fitBounds(data.lbounds);
        } else if (data.latlng) {
            map.setView([data.latlng[0], data.latlng[1]], 13);
        }
    }

    // $.getJSON("http://crowdhealth.herokuapp.com/api/v1/types", function(types) {
    //     $(types).each(function(index, type) {
    //         $.getJSON("http://crowdhealth.herokuapp.com/api/v1/types/" + type.name, function(data) {
    //             var featureLayer = L.mapbox.featureLayer();
    //             for (var i = 0; i < data.features.length; i++) {
    //                 var properties = data.features[i].properties;
    //                 properties.icon = {
    //                     "iconUrl": "img/" + type.name + ".png",
    //                     "iconSize": [30, 38.51],
    //                     "iconAnchor": [15, 38.51],
    //                     "popupAnchor": [0, -38.51],
    //                     "className": "dot"
    //                 }
    //             };

    //             // Set a custom icon on each marker based on feature properties.
    //             featureLayer.on('layeradd', function(e) {
    //                 var marker = e.layer,
    //                     feature = marker.feature;
    //                 marker.setIcon(L.icon(feature.properties.icon));
    //             });

    //             featureLayer.setGeoJSON(data);
    //             addLayer(featureLayer, type.name, index + 2);
    //         })
    //     });
    // });


    var layers = document.getElementById('menu-ui');

    function addLayer(layer, name, zIndex) {
        layer
            .setZIndex(zIndex)
            .addTo(map);

        // Create a simple layer switcher that
        // toggles layers on and off.
        var link = document.createElement('a');
        link.href = '#';
        link.className = 'active ' + name;
        link.innerHTML = name;

        link.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
                this.className = '';
            } else {
                map.addLayer(layer);
                this.className = 'active';
            }
        };

        layers.appendChild(link);
    }

    window.geocodeThis = function() {
        var text = document.getElementById('search').value;
        if (text.length >= 5) {
            geocoder.query(text, showMap);
        }
    }


});