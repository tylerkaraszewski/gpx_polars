Generate Polars Diagrams
------------------------

This tool takes GPX tracks (update: or FIT files) as output by Garmin or Strava (or probably most other tools that generate GPX) and turns them into a polars diagram. This is designed around kitesurfing or windsurfing, or maybe dinghy sailing, but generally for sailing sports in which no record of apparent wind is available. It uses a single, adjustable true wind direction per track. This is less accurate than having wind data recorded alongside speed data, but this is typically unavailable for kiting, and this tool allows for all required data to be recorded with a GPS-enabled smartwatch.

The tool can be used online here: [http://www.tylerkaraszewski.com/polars.html](http://www.tylerkaraszewski.com/polars.html)

This will output graphs like the following:

![5m_683_wave_session_10m_683_last_man_standing_in_light_wind_](https://user-images.githubusercontent.com/705000/56822736-cffbf800-6806-11e9-83c7-a750e4f74f58.png)

Use the slider at the top to set the wind direction. The blue area indicates boatspeed. The red area indicates VMG. The numbers are speeds, in knots (note that each number corresponds to the ring just *outside* the number. Use the innermost ring (2 kts) as reference if you get confused.

If you add a secondary GPX track, it will be drawn over the top of the primary track in a dotted line, allowing for easy comnparison. If the wind direction has shifted between the two recordings, expand the "Advanced Settings" section on the page, and you can adjust the wind angle of the secondary track in relation to the primary one. 
