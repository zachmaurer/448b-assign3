// Create the Google Map…
function initMap() {
    var map = new google.maps.Map(d3.select("#map").node(), {
        zoom: 13,
        center: new google.maps.LatLng(37.76487, -122.41948),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    var overlay = new google.maps.OverlayView();

    // var updateMarkers = function(data, overlay) {
    //     var padding = 10;

    //     var marker = layer.selectAll("svg")
    //         .data(d3.entries(data['data']))
    //         .each(transform) // update existing markers
    //         .enter().append("svg")
    //         .each(transform)
    //         .attr("class", "marker");

    //     // Add a circle.
    //     marker.append("circle")
    //         .attr("r", 4.5)
    //         .attr("cx", padding)
    //         .attr("cy", padding);
    // };

    // var globalData;

    // lat, long, radius
    // var poi = [[null, null, null], [null, null, null]];


    // Load the station data. When the data comes back, create an overlay.
    d3.json("scpd_incidents.json", function(error, data) {
        if (error) throw error;

        // globalData = data;

        // Add the container when the overlay is added to the map.
        overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayLayer).append("div")
                .attr("class", "incidents");

            // Draw each marker as a separate SVG element.
            // We could use a single SVG, but what size would it have?
            overlay.draw = function() {

            	// somehow package this out
                var projection = this.getProjection(),
                    padding = 10;

                var marker = layer.selectAll("svg")
                    .data(d3.entries(data['data']))
                    .each(transform) // update existing markers
                    .enter().append("svg")
                    .each(transform)
                    .attr("class", "marker");

                // Add a circle.
                marker.append("circle")
                    .attr("r", 4.5)
                    .attr("cx", padding)
                    .attr("cy", padding);

                // Add a label.
                // marker.append("text")
                //     .attr("x", padding + 7)
                //     .attr("y", padding)
                //     .attr("dy", ".31em")
                //     .text(function(d) {
                //         return d.key;
                //     });

                function transform(d) {
                    d = new google.maps.LatLng(d.value.Location[1], d.value.Location[0]);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px");
                }
            };
        };



        // Bind our overlay to the map…
        overlay.setMap(map);

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
    });


}
