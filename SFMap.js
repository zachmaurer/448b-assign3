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
