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
    var segmentIndex = findClosestSegment(e.latLng.lat(), e.latLng.lng());

    debugger;
    
    // Let's add another polyline.
    minSeg = Math.max(segmentIndex - 5, 0);
    maxSeg = Math.min(segmentIndex + 5, tracks[0].length - 1);
    const trackPath = new google.maps.Polyline({
        path: tracks[0].slice(minSeg, maxSeg),
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    trackPath.setMap(map);
}

function findClosestSegment(lat, lon) {
    const FIFTY_FEET_ISH = 0.000135;
    var candidates = [];
    var closestStartSegment = -1;
    for (var tryCount = 0; tryCount < 2; tryCount++) {
        var offset = tryCount ? FIFTY_FEET_ISH : 0;
        for (var i = 0; i < tracks[0].length - 2; i++) {
            if (Math.min(tracks[0][i].lat, tracks[0][i + 1].lat) - offset > lat) {
                continue;
            }
            if (Math.max(tracks[0][i].lat, tracks[0][i + 1].lat) + offset < lat) {
                continue;
            }
            if (Math.min(tracks[0][i].lng, tracks[0][i + 1].lng) - offset > lon) {
                continue;
            }
            if (Math.max(tracks[0][i].lng, tracks[0][i + 1].lng) + offset < lon) {
                continue;
            }
            candidates.push(i);
        }
        if (candidates.length) {
            break; // No need to run again if we found something.
        }
    }
    if (!candidates.length) {
        console.warn("Couldn't find any segments!");
    }

    // Ok, now we should have found some candidate segment IDs. If there's exactly one, just return it.
    if (candidates.length === 1) {
        return candidates[0];
    }

    // We're gonna call the distance from a line segment the average distance from both ends.
    var minimums = {
        distance: 1000000,
        index: -1,
    }
    for (var i = 0; i < candidates.length; i++) {
        var index = candidates[i];
        var distance1 = getDistanceInMeters(lat, lon, tracks[0][index].lat, tracks[0][index].lng);
        var distance2 = getDistanceInMeters(lat, lon, tracks[0][index + 1].lat, tracks[0][index + 1].lng);
        var distance = (distance1 + distance2) / 2;
        console.log(distance1, distance2);
        if (distance < minimums.distance) {
            minimums.distance = distance;
            minimums.index = index;
        }
    }

    return minimums.index;
}
