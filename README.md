Generate Polars Diagrams
------------------------

This tool takes a GPX track as output by Garmin or Strava (or probably most other tools that generate GPX) and turns it into a polars diagram. This is designed around kitesurfing or windsurfing, or maybe dinghy sailing, but generally for sailing sports in which no record of apparent wind is available. It uses a single, adjustable true wind direction. This is less accurate than having wind data recorded alongside speed data, but this is typically unavailable for kiting, and this tool allows for all required data to be recorded with a GPS-enabled smartwatch.

The tool can be used online here: [http://www.tylerkaraszewski.com/polars.html](http://www.tylerkaraszewski.com/polars.html)

This will output graphs like the following:

<img width="665" alt="Screen Shot 2019-04-13 at 5 49 08 PM" src="https://user-images.githubusercontent.com/705000/56097995-351f2780-5eb0-11e9-9c63-e9115f92fc75.png">

Use the slider at the top to set the wind direction. The blue area indicates boatspeed. The red area indicates VMG. The numbers are speeds, in knots (note that each number corresponds to the ring just *outside* the number. Use the innermost ring (2 kts) as reference if you get confused.
