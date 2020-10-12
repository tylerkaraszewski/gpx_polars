var map;
function drawMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: initialPoint.lat, lng: initialPoint.lon },
        zoom: 8
    });
}
