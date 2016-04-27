// Create the Google Map…
function initMap() {

//------------ initializing the map
    var map = new google.maps.Map(d3.select("#map").node(), {
        zoom: 13,
        center: new google.maps.LatLng(37.76487, -122.41948),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    var overlay = new google.maps.OverlayView(),
        globalData,
        padding = 10,
        valid_days = [true, true, true, true, true, true, true],
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//--------------- constructing POIs

var POI_LATLNG = [{
      lat: 37.76487,
      lng: -122.41948
    },
    { lat: 37.76000,
      lng: -122.40

            }];

var POI1 = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 0.5,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: POI_LATLNG[0],
      radius: 1000,
      editable: true,
      draggable: true,
    });

var POI2 = new google.maps.Circle({
      strokeColor: '#28E3FC',
      strokeOpacity: 0.8,
      strokeWeight: 0.5,
      fillColor: '#28E3FC',
      fillOpacity: 0.35,
      map: map,
      center: POI_LATLNG[1],
      radius: 1000,
      editable: true,
      draggable: true,
    });

google.maps.event.addListener(POI1, 'radius_changed', function() { 
    d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(filterIntersection); // update existing markers

});

google.maps.event.addListener(POI2, 'radius_changed', function() { 
    d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(filterIntersection); // update existing markers

});


google.maps.event.addListener(POI1, 'dragend', function() { 
    d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(filterIntersection); // update existing markers

});

google.maps.event.addListener(POI2, 'dragend', function() { 
    d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(filterIntersection); // update existing markers
});


var filterIntersection = function(d) {
    var _dLatLng = new google.maps.LatLng(d.value.Location[1], d.value.Location[0]);
    var distToPOI1 = google.maps.geometry.spherical.computeDistanceBetween(POI1.center, _dLatLng);
    var distToPOI2 = google.maps.geometry.spherical.computeDistanceBetween(POI2.center, _dLatLng);
    if (distToPOI1 < POI1.radius && distToPOI2 < POI2.radius) {
        d3.select(this).style('visibility', 'visible');
    } else {
        d3.select(this).style('visibility', 'hidden');
    }
}




//--------------- initializing searchboxes

    //----- custom markers
    var pinColor1 = "FF0000";
    var pinColor2 = "28E3FC";

    var pinImage1 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor1,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
    var pinImage2 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor2,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
    var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));



    // Create the search box and link it to the UI element.
    var poi1Input = document.getElementById('pac-input1');
    var poi2Input = document.getElementById('pac-input2');

    var searchBox1 = new google.maps.places.SearchBox(poi1Input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(poi1Input);
    
    var searchBox2 = new google.maps.places.SearchBox(poi2Input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(poi2Input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox1.setBounds(map.getBounds());
      searchBox2.setBounds(map.getBounds());
    });

    var markers1 = [];
    var markers2 = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    
    searchBox1.addListener('places_changed', function() {
      var places = this.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers1.forEach(function(marker) {
        marker.setMap(null);
      });
      markers1 = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      
      if (places.length == 1) {
        POI1.setCenter(places[0].geometry.location); 
        d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(filterIntersection); // update existing markers 
      } else {
        places.forEach(function(place) {
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers1.push(new google.maps.Marker({
              map: map,
              icon: pinImage1,
              title: place.name,
              position: place.geometry.location
            }));
        });
      }
    });
  
    
    searchBox2.addListener('places_changed', function() {
      var places = this.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers2.forEach(function(marker) {
        marker.setMap(null);
      });
      markers2 = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      
      if (places.length == 1) {
        POI2.setCenter(places[0].geometry.location); 
        d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(filterIntersection); // update existing markers 
      } else {
        places.forEach(function(place) {
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var m = new google.maps.Marker({
              map: map,
              icon: pinImage2,
              title: place.name,
              position: place.geometry.location
            });

            m.addListener('click',function(){
                POI2.setCenter(this.position); 
                d3.select('.incidents').selectAll("svg")
                    .data(d3.entries(globalData['data']))
                    .each(filterIntersection); // update existing markers 
                markers2.forEach(function(marker) {
                    marker.setMap(null);
                });
                markers2 = [];
            });

            markers2.push(m);

            //There is a scope issue here where markers2 gets turned into an array of "nb"
            // markers2.push(new google.maps.Marker({
            //   map: map,
            //   icon: pinImage2,
            //   title: place.name,
            //   position: place.geometry.location
            // }).addListener('click',function(){
            //     POI2.setCenter(this.position); 
            //     d3.select('.incidents').selectAll("svg")
            //         .data(d3.entries(globalData['data']))
            //         .each(filterIntersection); // update existing markers 
            //     console.log(markers2);
            //     markers2.forEach(function(marker) {
            //         marker.setMap(null);
            //         console.log("setting markers to bull");
            //     });
            //     markers2 = [];
            // }));
        });
      }
    });


//--------------- painting the crime sites
    var updateMarkers = function(data) {

        var marker = d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(transformMarkers) // update existing markers
            .enter().append("svg")
            .each(transformMarkers)
            .attr("class", "marker");

        // Add a circle.
        marker.append("circle")
            .attr("r", 4.5)
            .attr("cx", padding)
            .attr("cy", padding);
    };

    function transformMarkers(d) {
        d = new google.maps.LatLng(d.value.Location[1], d.value.Location[0]);
        d = overlay.getProjection().fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
    };



 //------------- day checkbox functionality
    var filterDays = function(d) {
        var index = day_names.indexOf(d.value.DayOfWeek),
            is_valid = valid_days[index];
        if (is_valid) {
            d3.select(this).style('visibility', 'visible');
        } else {
            d3.select(this).style('visibility', 'hidden');
        }
    };
   


    $("input[type='checkbox']").change(function() {

        $("input[type='checkbox']").each(function(index, element) {
            valid_days[index] = element.checked;
            // console.log(element.id)
            // console.log(element.checked)
        });

        d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(filterDays); // update existing markers
    });





    // lat, long, radius
    // var poi = [[null, null, null], [null, null, null]];

//------------ initializing the overlay with data 
    d3.json("scpd_incidents.json", function(error, data) {
        if (error) throw error;

        globalData = data;

        // Add the container when the overlay is added to the map.
        overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayLayer).append("div")
                .attr("class", "incidents");

            // Draw each marker as a separate SVG element.
            overlay.draw = function() {
                updateMarkers(data)
            };
        };

        // Bind our overlay to the map…
        overlay.setMap(map);
    });
}




// ------------ makes checkboxes animated and fancy
$(document).ready(function() {
    $('input#input_text, textarea#textarea1').characterCounter();
});





// map.addListener('click', function(e) {
//     var layer = d3.select('incidents');

//     if(!poi[0][0]) { //first poi is blank
//     	poi[0][0] = e.latLng[0];
//     	poi[0][1] = e.latLng[1];
//     	poi[0][2] = 5; //start with a radius of 5 
//     }

//     var marker = layer.selectAll("not important")
//             .data(poi[0]) // how is this gonna work for both or just for individual ones?
//             .each(transform) // update existing markers
//             .enter().append("svg")
//             .each(transform)
//             .attr("class", "marker");

//     marker.append("circle")
//             .attr("r", 5)  //static for now 
//             .attr("cx", padding)
//             .attr("cy", padding);

//         // add an svg dot
// });
