// https://stackoverflow.com/questions/7570808/how-do-i-calculate-the-difference-of-two-angle-measures/30887154
function angleFromWind(heading, wind) {
    var phi = Math.abs(heading - wind) % 360;
    var angleOffTheWind = phi > 180 ? 360 - phi : phi;
    if (angleOffTheWind > 90) {
        angleOffTheWind = 180 - angleOffTheWind;
    }
    return angleOffTheWind;
}

// Copied from: https://www.movable-type.co.uk/scripts/latlong.html
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // metres
    var φ1 = lat1 * (Math.PI / 180);
    var φ2 = lat2 * (Math.PI / 180);
    var Δφ = (lat2-lat1) * (Math.PI / 180);
    var Δλ = (lon2-lon1) * (Math.PI / 180);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d;
}

function getBearingInDegrees(lat1, lon1, lat2, lon2) {
    var φ1 = lat1 * (Math.PI / 180);
    var λ1 = lon1 * (Math.PI / 180);
    var φ2 = lat2 * (Math.PI / 180);
    var λ2 = lon2 * (Math.PI / 180);
    var y = Math.sin(λ2-λ1) * Math.cos(φ2);
    var x = Math.cos(φ1)*Math.sin(φ2) -
            Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2-λ1);
    var brng = Math.atan2(y, x) * (180 / Math.PI);

    return (brng + 360) % 360;
}
