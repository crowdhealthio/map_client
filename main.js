// Provide your access token

$(document).ready(function() {
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2hlbGRvbmxpbmUiLCJhIjoiRVRIYlNIYyJ9.3hMiE63z6mxyBBPe1-mxiQ';


    var map = L.mapbox.map('map', 'sheldonline.m6mg14f5', {
        zoomControl: false
    }).addControl(L.mapbox.geocoderControl('mapbox.places', {
        keepOpen: true,
        autocomplete: true
    }));


    new L.Control.Zoom({
        position: 'bottomright'
    }).addTo(map);

    var myLayer = L.mapbox.featureLayer().addTo(map);

    window.onload = function(e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();
    }

    map.on('locationfound', function(e) {
        map.fitBounds(e.bounds);
        map.setZoom(17);

        myLayer.setGeoJSON({
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
        });

        // And hide the geolocation button
    });

    var myIcon = L.icon({
        iconUrl: 'img/mapicon.png',
        iconRetinaUrl: 'img/mapicon.png',
        iconSize: [30, 38.51],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        // shadowUrl: 'my-icon-shadow.png',
        // shadowRetinaUrl: 'my-icon-shadow@2x.png',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });


    var featureLayer1 = L.mapbox.featureLayer()
    var featureLayer2 = L.mapbox.featureLayer()
    var featureLayer3 = L.mapbox.featureLayer()

    // Set a custom icon on each marker based on feature properties.
    featureLayer1.on('layeradd', function(e) {
        var marker = e.layer,
            feature = marker.feature;
        marker.setIcon(L.icon(feature.properties.icon));
    });

    // featureLayer2.on('layeradd', function(e) {
    //     var marker = e.layer,
    //         feature = marker.feature;
    //     console.log(feature);
    //     marker.setIcon(L.icon(feature.properties.icon));
    // });

    // featureLayer3.on('layeradd', function(e) {
    //     var marker = e.layer,
    //         feature = marker.feature;
    //     marker.setIcon(L.icon(feature.properties.icon));
    // });
    var geocoder = L.mapbox.geocoder('mapbox.places')



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

    $.getJSON("william-and-mary-notable-trees-map.geojson", function(data) {
        featureLayer1.setGeoJSON(data);
        addLayer(featureLayer1, 'Notable Trees', 2);
    });

    $.getJSON("water-features.geojson", function(data) {
        featureLayer2.setGeoJSON(data);
        addLayer(featureLayer2, 'Water Features', 3);
    });

    $.getJSON("http://crowdhealth.herokuapp.com/api/v1/artifacts", function(data) {
        featureLayer3.setGeoJSON(data);
        addLayer(featureLayer3, 'Health', 4);
    });


    var layers = document.getElementById('menu-ui');
    // addLayer(L.mapbox.tileLayer('examples.bike-lanes'), 'Bike Lanes', 2);
    // addLayer(L.mapbox.tileLayer('examples.bike-locations'), 'Bike Stations', 3);

    function addLayer(layer, name, zIndex) {
        layer
            .setZIndex(zIndex)
            .addTo(map);

        // Create a simple layer switcher that
        // toggles layers on and off.
        var link = document.createElement('a');
        link.href = '#';
        link.className = 'active';
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

    // $(document).foundation();
    // $(".full-height").height($(".main").parent().height());

});