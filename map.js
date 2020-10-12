var map;
function drawMap() {
    var center = {
        lat: 0,
        lng: 0,
    };
    if (tracks[0].length) {
        center.lat = tracks[0][0].lat;
        center.lng = tracks[0][0].lng;
    }
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 8
    });

    if (tracks[0].length) {
        // Fit the map to our area.
        minLat = tracks[0].reduce(function(a, b) { return Math.min(a, b.lat); }, 361);
        minLon = tracks[0].reduce(function(a, b) { return Math.min(a, b.lng); }, 361);
        maxLat = tracks[0].reduce(function(a, b) { return Math.max(a, b.lat); }, -361);
        maxLon = tracks[0].reduce(function(a, b) { return Math.max(a, b.lng); }, -361);

        bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(minLat, minLon));
        bounds.extend(new google.maps.LatLng(maxLat, maxLon));
        map.fitBounds(bounds);
        map.panToBounds(bounds);

        // Draw a line.
        const trackPath = new google.maps.Polyline({
            path: tracks[0],
            geodesic: true,
            strokeColor: "#0000FF",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });
        trackPath.setMap(map);

        google.maps.event.addListener(trackPath, 'click', polyLineClick);
    }
}

function polyLineClick(e) {
    console.log(e.latLng.lat(), e.latLng.lng());
}
