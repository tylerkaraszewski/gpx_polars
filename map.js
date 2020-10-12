var map;
function drawMap() {
    var center = {
        lat: 0,
        lng: 0,
    };
    if (tracks[0].length) {
        center.lat = tracks[0][0].lat;
        center.lng = tracks[0][0].lon;
    }
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 8
    });
}
