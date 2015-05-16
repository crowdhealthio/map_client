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

// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function() {
    geolocate.innerHTML = 'Position could not be found';
});
$.getJSON("william-and-mary-notable-trees-map.geojson", function(data) {
  L.mapbox.featureLayer(data).addTo(map);
});
});
