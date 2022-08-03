// Define earthquakes plates GeoJSON url variable
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create earthquake layerGroup
var earthquakes = L.layerGroup();

// Create tile layer
var grayscaleMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  // tileSize: 512,
  maxZoom: 18,
  // zoomOffset: -1,
  id: "mapbox/light-v10",
  // accessToken: API_KEY
});

// Create the map, giving it the grayscaleMap and earthquakes layers to display on load
var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 4,
  layers: [grayscaleMap, earthquakes]
});

d3.json(earthquakesURL, function(earthquakeData) {
  // Determine the marker size by magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  };
  // Determine the marker color by depth
  function chooseColor(depth) {
    switch(true) {
      case depth > 90:
        return "pink";
      case depth > 70:
        return "magenta";
      case depth > 50:
        return "green";
      case depth > 30:
        return "gold";
      case depth > 10:
        return "yellow";
      default:
        return "lightblue";
    }
  }

  // Create a GeoJSON layer containing the features array
  // Each feature a popup describing the place and time of the earthquake
  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        // Set the style of the markers based on properties.mag
        {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
      + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakes);
  // Sending our earthquakes layer to the createMap function
  earthquakes.addTo(myMap);

    // Add legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
    
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  for (var i =0; i < depth.length; i++) {
    div.innerHTML += 
    '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
    return div;
  };
  legend.addTo(myMap);
});