// Any globals are defined here.

// Global array of tracks. Can have two tracks.
var tracks = [[], []];

(function initPage() {
    // Set up the slider.
    var angleSlider = document.getElementById("angle");
    document.getElementById("current_angle").innerHTML = "Current Angle: " + angleSlider.value;
    angleSlider.addEventListener("change", function(){
        document.getElementById("current_angle").innerHTML = "Current Angle: " + angleSlider.value;
        draw();
    }, false);

    // Set up the file loaders.
    var jsonFileInput1 = document.getElementById("gpx1");
    var jsonFileInput2 = document.getElementById("gpx2");

    // loadTrackFromFile defined in polars.js
    jsonFileInput1.addEventListener("change", loadTrackFromFile, false);
    jsonFileInput2.addEventListener("change", loadTrackFromFile, false);

    document.getElementById("advanced_settings_toggle").addEventListener("click", function() {
        if (document.getElementById("advanced_settings").style.display == "") {
            document.getElementById("advanced_settings").style.display = "none";
            document.getElementById("advanced_settings_toggle").innerHTML =
            document.getElementById("advanced_settings_toggle").innerHTML.replace(/\-/, "+");
        } else {
            document.getElementById("advanced_settings").style.display = "";
            document.getElementById("advanced_settings_toggle").innerHTML =
            document.getElementById("advanced_settings_toggle").innerHTML.replace(/\+/, "-");
        }
    }, false);

    document.getElementById("bucket_size").addEventListener("change", function() {
        bucketDegreeIncrement = Math.floor(document.getElementById("bucket_size").value);
        initBucketsAndSpeeds(1);
        initBucketsAndSpeeds(2);
        loadComplete("gpx1");
        loadComplete("gpx2");
    }, false);

    document.getElementById("seconds_course").addEventListener("change", function() {
        directionTimeIntervalSecs = Math.floor(document.getElementById("seconds_course").value);
        initBucketsAndSpeeds(1);
        initBucketsAndSpeeds(2);
        loadComplete("gpx1");
        loadComplete("gpx2");
    }, false);

    document.getElementById("secondary_offset_degrees").addEventListener("change", function() {
        secondaryAdjustment = parseFloat(document.getElementById("secondary_offset_degrees").value);
        initBucketsAndSpeeds(1);
        initBucketsAndSpeeds(2);
        loadComplete("gpx1");
        loadComplete("gpx2");
    }, false);
})();
