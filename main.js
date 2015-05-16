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
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

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

    $.getJSON("http://crowdhealth.herokuapp.com/api/v1/types", function(types) {
        console.log(types);
        $(types).each(function(index, type) {
            $.getJSON("http://crowdhealth.herokuapp.com/api/v1/types/" + type.name, function(data) {
                var featureLayer = L.mapbox.featureLayer();
                featureLayer.setGeoJSON(data);
                addLayer(featureLayer, type.name, index + 2);
            })
        });
    });


    var layers = document.getElementById('menu-ui');

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


});