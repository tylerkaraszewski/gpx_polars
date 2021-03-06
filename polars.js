// Set up the compiled C++ FIT file decoder.
decode_fit = Module.cwrap('decode_fit', 'string', ['number', 'array'])

// Use integers between 1 and 6, inclusive.
var bucketDegreeIncrement = 3;
var directionTimeIntervalSecs = 3;

function parseTrackData(trackIndex, e) {
    try {
        var gpxString;
        // If e.target.result is an ArrayBuffer, this is a FIT file.
        if (e.target.result instanceof ArrayBuffer) {
            const data = new Uint8Array(e.target.result);
            gpxString = decode_fit(data.length, data);
        } else {
            // Otherwise, it should be raw GPX.
            gpxString = e.target.result;
        }

        // Now that we have GPX data, we can parse it.
        var parser = new DOMParser();
        parseDataFromXML(trackIndex, parser.parseFromString(gpxString, "application/xml"));
        fileLoadCompleteCallback();
    } catch (e) {
        console.warn(e);
    }
};

function loadTrackFromFile(e) {
    var reader = new FileReader();
    reader.onload = function(evt) {
        parseTrackData(e.target.id === "gpx1" ? 0 : 1, evt);
        fileLoadCompleteCallback();
    };
    if (e.target.files[0].name.match(/\.fit$/i)) {
        // FIT files.
        reader.readAsArrayBuffer(e.target.files[0]);
    } else if (e.target.files[0].name.match(/\.gpx$/i)) {
        // GPX files.
        reader.readAsText(e.target.files[0]);
    } else {
        // Anything else. (assume GPX)
        reader.readAsText(e.target.files[0]);
    }
}

function parseDataFromXML(index, xml) {
    var trks;
    var trks = xml.getElementsByTagName("trk");
    if (!trks) {
        return
    }
    if (trks.length === 0) {
        return;
    }
    if (trks.length !== 1) {
        console.warn("Unexpected number of tracks");
        return;
    }

    var trksegs = trks[0].getElementsByTagName("trkseg");
    if (trks.length > 1) {
        console.warn("Unexpected number of track segments, only using the first one.");
    }
    if (trks.length == 0) {
        console.warn("No track segments.");
        return;
    }

    // Ok, this is hopefully usable.
    var trkseg = trksegs[0];

    // Now we'll start iterating all of our points.
    var current = trkseg.firstElementChild;
    //var previous = null;
    var parsedList = [];
    while (current) {
        // Make sure this looks correct.
        if (current.nodeName !== "trkpt") {
            console.warn("Invalid node, skipping.", current);
            current = current.nextElementSibling;
            continue;
        }

        // Parse the useful information out of our point.
        var parsed = {};
        var lat = parseFloat(current.getAttribute("lat"));
        var lon = parseFloat(current.getAttribute("lon"));
        var time;
        try {
            // First, try and parse it as an integer. If this is a 4-digit number, it's the year portion of a
            // string, and we'll do over and parse the whole string. Otherwise, it's a unix timestamp that we
            // extracted from a FIT file.
            var parsedTime = parseInt(current.getElementsByTagName("time")[0].innerHTML);
            if (parsedTime > 10000) {
                time = parsedTime * 1000;
            } else {
                // TODO: This is apparently frowned upon, but it's working with Garmin's date stamps and
                // Firefox/Chrome just fine.
                time = Date.parse(current.getElementsByTagName("time")[0].innerHTML);
            }
        } catch (e) {
            console.warn("Couldn't parse time for element, skipping.", current);
            current = current.nextElementSibling;
            continue;
        }
        parsed.lat = lat;
        parsed.lng = lon;
        parsed.time = time;
        parsedList.push(parsed);

        current = current.nextElementSibling;
    }
    tracks[index] = parsedList;
}

function computeSpeeds(trackIndex) {
    var bestSpeeds = [];

    // Compute average speed only while moving.
    var movingSpeedThreshold = 8;
    var totalMovingDistance = 0;
    var totalMovingTime = 0;
    for (var i = 0; i < tracks[trackIndex].length - 1; i++) {
        var start = tracks[trackIndex][i];
        var end = tracks[trackIndex][i + 1];
        var elapsedTime = end.time - start.time;
        var distanceNM = distanceMeters / 1852;
        var speedKnots = (distanceMeters / 1852) / ((elapsedTime / 1000) / (60 * 60));
        var distanceMeters = getDistanceInMeters(start.lat, start.lng, end.lat, end.lng);
        if (speedKnots > movingSpeedThreshold) {
            totalMovingDistance += distanceNM;
            totalMovingTime += elapsedTime;
        }
    }
    var avgSpeendNM = Math.round(totalMovingDistance / ((totalMovingTime / 1000) / (60 * 60)) * 100) / 100;
    console.log("Distance above " + movingSpeedThreshold + " knots speed: " +
        (Math.round(totalMovingDistance * 100) / 100) + " NM, in " +
        (totalMovingTime / 1000) + " seconds: " + avgSpeendNM + " knots.");

    // Now that we have a list of points, sort them into buckets.
    var buckets = [];
    for (var i = 0; i < (360 / bucketDegreeIncrement); i++) {
        buckets.push([]);
    }
    for (var i = 0; i < tracks[trackIndex].length; i++) {
        current = tracks[trackIndex][i];
        var distance = 1;
        while (i + distance < tracks[trackIndex].length) {
            target = tracks[trackIndex][i + distance];
            if (target.time >= current.time + directionTimeIntervalSecs * 1000) {
                // It's been enough time to count this segment.
                var elapsedTime = target.time - current.time;
                var distanceMeters = getDistanceInMeters(current.lat, current.lng, target.lat, target.lng);
                var distanceNM = distanceMeters / 1852;
                var speedKnots = (distanceMeters / 1852) / ((elapsedTime / 1000) / (60 * 60));
                var bearing = getBearingInDegrees(current.lat, current.lng, target.lat, target.lng);

                // Now save this data.
                var index = (Math.floor(Math.floor(bearing + 0.5) / bucketDegreeIncrement)) % buckets.length;
                buckets[index].push(speedKnots);

                // Done, on to the next.
                break;
            }
            distance++;
        }
    }

    for (var i = 0; i < buckets.length; i++) {
        var array = buckets[i];
        array.sort(function(a, b){return b - a});

        var top3 = array.slice(0, 3);
        if (top3.length == 0) {
            top3.push(0);
        }
        var sum = 0;
        for (var j = 0; j < top3.length; j++) {
            sum += top3[j];
        }
        sum /= top3.length;
        bestSpeeds.push(sum);
    }

    return bestSpeeds;
}

function drawPolars() {
    // Get the best speeds for both tracks.
    var bestSpeeds = [computeSpeeds(0), computeSpeeds(1)];

    const DIMENSION = 400;
    // If there's no speed data (because someone dragged the slider before loading a file), there's nothing to
    if (!bestSpeeds[0].length && !bestSpeeds[1].length) {
        return;
    }

    // Get the angle the slider is set to.
    var angle = parseFloat(document.getElementById("angle").value);

    // Find the highest speed.
    var count = Math.max(bestSpeeds[0].length, bestSpeeds[1].length);
    var max = Math.ceil(bestSpeeds[0].concat(bestSpeeds[1]).reduce(function(a, b) { return Math.max(a, b); })) + 2;

    var canvas = document.getElementById('canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = DIMENSION * window.devicePixelRatio;
        canvas.height = DIMENSION * window.devicePixelRatio;
        canvas.id = 'canvas';
        var saveLink = document.createElement("a");
        saveLink.download = "gpx_polars_graph.png";
        saveLink.id = "save_download";
        document.getElementById('canvas_container').appendChild(saveLink);
        saveLink.appendChild(canvas);
    }
    var ctx = canvas.getContext('2d');

    // Fill with white, restore, and save in "clean" state.
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.save();

    // Scale the canvas to fit a unit circle. DIMENSION is the magic number specified in the size/width of the element.
    ctx.scale((DIMENSION * window.devicePixelRatio) / 2, (DIMENSION * window.devicePixelRatio) / 2);
    ctx.lineWidth = 2 / (DIMENSION * window.devicePixelRatio);

    // Translate it so that the origin is in the middle.
    ctx.translate(1, 1);

    // Flip the Y-axis.
    ctx.scale(1, -1);

    // Actually draw the main polar shape. We do this first so the labels go over it.
    for (var outline = 0; outline < 2; outline++) {
        if (outline == 1) {
            angle += secondaryAdjustment = parseFloat(document.getElementById("secondary_offset_degrees").value);
        }

        var bestSpeed;
        if (outline == 0) {
            bestSpeed = bestSpeeds[0];
        } else {
            bestSpeed = bestSpeeds[1];
        }

        // Skip any undefined sections.
        if (bestSpeed.length === 0) {
            continue;
        }
        ctx.save()
        ctx.rotate((Math.PI / 180) * (-0.5 * bucketDegreeIncrement + angle));
        ctx.beginPath();
        ctx.moveTo(0, bestSpeed[0] / max);
        for (var i = 1; i < count; i++) {
            ctx.rotate((Math.PI / 180) * -1 * bucketDegreeIncrement);
            ctx.lineTo(0, bestSpeed[i] / max);
        }
        ctx.closePath();
        if (outline == 0) {
            ctx.fillStyle = 'rgba(128, 148, 224, 1)';
            ctx.fill();
        } else {
            ctx.setLineDash([0.01, 0.01]);
            ctx.lineWidth = ctx.lineWidth * 1.5;//2 / 1200;
            ctx.strokeStyle = 'rgba(30, 30, 255, 1)';
            ctx.stroke();
        }
        ctx.rotate((Math.PI / 180) * -0.5 * bucketDegreeIncrement);
        ctx.restore();

        // Same thing again, but for VMG.
        ctx.save()
        ctx.rotate((Math.PI / 180) * (-0.5 * bucketDegreeIncrement + angle));
        ctx.beginPath();
        var compassAngle = 0.5 * bucketDegreeIncrement;
        ctx.moveTo(0, (bestSpeed[i] / max) * Math.cos((Math.PI / 180) * angleFromWind(compassAngle, angle)));
        for (var i = 1; i < count; i++) {
            ctx.rotate((Math.PI / 180) * -1 * bucketDegreeIncrement);
            compassAngle += bucketDegreeIncrement;
            ctx.lineTo(0, (bestSpeed[i] / max) * Math.cos((Math.PI / 180) * angleFromWind(compassAngle, angle)));
        }
        ctx.closePath();
        if (outline == 0) {
            ctx.fillStyle = 'rgba(224, 148, 128, 1)';
            ctx.fill();
        } else {
            ctx.setLineDash([0.01, 0.01]);
            ctx.lineWidth = ctx.lineWidth * 1.5;//2 / 1200;
            ctx.strokeStyle = 'rgba(255, 30, 30, 1)';
            ctx.stroke();
        }
        ctx.rotate((Math.PI / 180) * -0.5 * bucketDegreeIncrement);
        ctx.restore();
    }

    // Draw some angle lines.
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
        ctx.moveTo(-1, 0);
        ctx.lineTo(1, 0);
        ctx.stroke();
        ctx.rotate((Math.PI / 180) * (30));
    }
    ctx.restore();

    // Draw some circles with labels.
    // NOTE: We scale everything by 1/100th for this, because the fonts won't draw correctly in tiny fractional
    // sizes.
    ctx.save();
    ctx.scale(1, -1);
    ctx.scale(1/1000, 1/1000);
    ctx.lineWidth = ctx.lineWidth * 1000;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.textBaseline = 'bottom';
    ctx.font = '36px sans-serif';
    for (var i = 2; i < max; i += 2) {
        ctx.beginPath();
        ctx.arc(0, 0, (i / max) * 1000, 0, Math.PI * 2);
        ctx.stroke();

        var label = '' + i;// + 'kts';
        var textWidth = ctx.measureText(label).width;
        ctx.fillText(label, ((i / max) * 1000) - textWidth - 10, 0);
    }
    ctx.restore();

    // Put it back to the original.
    ctx.restore();

    // Update the save link with the new data.
    document.getElementById('save_download').href = canvas.toDataURL("image/png");
    var name1 = document.getElementById('gpx1').files.length ? document.getElementById('gpx1').files[0].name : null;
    var name2 = document.getElementById('gpx2').files.length ? document.getElementById('gpx2').files[0].name : null;
    var name = "";
    if (name1) {
        name += name1.replace(/\..+$/, "");
    }
    if (name1 && name2) {
        name += "_";
    }
    if (name2) {
        name += name2.replace(/\..+$/, "");
    }
    document.getElementById('save_download').download = name + ".png";
}

