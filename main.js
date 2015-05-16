// Provide your access token

$( document ).ready(function() {
  L.mapbox.accessToken = 'pk.eyJ1Ijoic2hlbGRvbmxpbmUiLCJhIjoiRVRIYlNIYyJ9.3hMiE63z6mxyBBPe1-mxiQ';


var map = L.mapbox.map('map', 'sheldonline.10ac597b', {zoomControl: false}).addControl(L.mapbox.geocoderControl('mapbox.places',{
        keepOpen: true
    }));


new L.Control.Zoom({ position: 'topright' }).addTo(map);

var myLayer = L.mapbox.featureLayer().addTo(map);

    window.onload = function (e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();

}

map.on('locationfound', function(e) {
    map.fitBounds(e.bounds);

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

$.getJSON("william-and-mary-notable-trees-map.geojson", function(data) {
  // L.mapbox.featureLayer(data);
  addLayer(L.mapbox.featureLayer(data), 'Notable Trees', 2);
});

$.getJSON("water-features.geojson", function(data) {
  // L.mapbox.featureLayer(data);
  addLayer(L.mapbox.featureLayer(data), 'Water Features', 3);
});

$.getJSON("http://crowdhealth.herokuapp.com/api/v1/artifacts", function(data) {
  // L.mapbox.featureLayer(data);
  addLayer(L.mapbox.featureLayer(data), 'Test', 4);
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


});
