// Create the Google Map…
function initMap() {

    var mapStyles = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "5"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "20"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "10"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
];



    var overlay = new google.maps.OverlayView(),
        globalData,
        padding = 10,
        valid_days = [true, true, true, true, true, true, true],
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        pinColor1 = "#75ABBC",
        pinColor2 = "#6AABA2",
        POI_LATLNG = [{
            lat: 37.7650,
            lng: -122.45
        }, {
            lat: 37.76000,
            lng: -122.42
        }],
        searchBoxes = [],
        time_range = [0, 24];


    //------------ initializing the map
    var map = new google.maps.Map(d3.select("#map").node(), {
        zoom: 12,
        center: new google.maps.LatLng(37.76487, -122.41948),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP,
        },
        streetViewControl: false,
    });

    map.setOptions({styles: mapStyles});


    // -------------- creating POI ------------
    var createPOI = function(color, index) {
        var POI = new google.maps.Circle({
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: color,
            fillOpacity: 0.05,
            map: map,
            center: POI_LATLNG[index],
            radius: 1000*(index+1),
            editable: true,
            draggable: true,
            suppressUndo: true,
        });

        google.maps.event.addListener(POI, 'radius_changed', function() {
            d3.select('.incidents').selectAll("svg")
                .data(d3.entries(globalData['data']))
                .each(macDaddyFilter); // update existing markers

        });

        google.maps.event.addListener(POI, 'dragend', function() {
            d3.select('.incidents').selectAll("svg")
                .data(d3.entries(globalData['data']))
                .each(macDaddyFilter); // update existing markers

        });

        return POI;
    }

    //--------------- creating pins

    var createPin = function(color) {
        return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
    }

    //--------------- creating searchboxes
    var createSearchBoxes = function() {

        $('.searchbox').each(function() {
            var searchBox = new google.maps.places.SearchBox(this),
                markers = [],
                pinImage = this.id == 'pac-input1' ? pinImage1 : pinImage2,
                POI = this.id == 'pac-input1' ? POI1 : POI2;


            searchBox.addListener('places_changed', function() {
                var places = this.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();

                if (places.length == 1) {
                    POI.setCenter(places[0].geometry.location);
                    d3.select('.incidents').selectAll("svg")
                        .data(d3.entries(globalData['data']))
                        .each(macDaddyFilter); // update existing markers 
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
                        marker = new google.maps.Marker({
                            map: map,
                            icon: pinImage,
                            title: place.name,
                            position: place.geometry.location
                        });

                        marker.addListener('click', function() {
                            POI.setCenter(place.geometry.location);
                            d3.select('.incidents').selectAll("svg")
                                .data(d3.entries(globalData['data']))
                                .each(macDaddyFilter); // update existing markers 
                            markers.forEach(function(old_marker) {
                                old_marker.setMap(null);
                            });

                        });
                        markers.push(marker);
                    });
                }
            });
            searchBoxes.push(searchBox);
        });
    }



    // ------------ INNITIALIZING ALL PINS & SEARCHBOXES --------
    var POI1 = createPOI(pinColor1, 0),
        POI2 = createPOI(pinColor2, 1),
        pinImage1 = createPin(pinColor1.substring(1)), // taking off the # for the hex color
        pinImage2 = createPin(pinColor2.substring(1));


    createSearchBoxes();


  // // --------- creating time slider -----------
    var slider = new Slider("#time-slider", {
        id: "slider12c",
        min: 0,
        max: 24,
        range: true,
        value: [0, 24],
    });





    // ------ FILTER FUNCTIONALITY ----------

    var filterIntersection = function(d) {
        var _dLatLng = new google.maps.LatLng(d.value.Location[1], d.value.Location[0]);
        var distToPOI1 = google.maps.geometry.spherical.computeDistanceBetween(POI1.center, _dLatLng);
        var distToPOI2 = google.maps.geometry.spherical.computeDistanceBetween(POI2.center, _dLatLng);
        if (distToPOI1 < POI1.radius && distToPOI2 < POI2.radius) {
            return true;
        } else {
            return false;
        }
    }

    var filterDays = function(d) {
        var index = day_names.indexOf(d.value.DayOfWeek),
            is_valid = valid_days[index];
        if (is_valid) {
            return true;
        } else {
            return false;
        }
    };

    var filterTime = function(d) {
        var hour = parseInt(d.value.Time.split(":")[0]);
        if (hour == time_range[0] || hour == time_range[1]) {return true};

        if (hour > time_range[0] && hour < time_range[1]) {
            return $('.switch input')[0].checked ? false : true;
        } else {
            return $('.switch input')[0].checked ? true : false;
        }

    };


    var macDaddyFilter = function(d) {
        if (filterIntersection(d) && filterDays(d) && filterTime(d)) {
            d3.select(this).style('visibility', 'visible');
            // console.log(d)
        } else {
            d3.select(this).style('visibility', 'hidden');
        }
    };


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
            .attr("r", 1.5)
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


    var applyFilters = function() {
        d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(macDaddyFilter); // update existing markers
    };


    var showTime = function() {
        if ($('.switch input')[0].checked) {
            $('.selected-time').text(time_range[1] + 'h to ' + time_range[0]+'h');
        } else {
            $('.selected-time').text(time_range[0] + 'h to ' + time_range[1]+'h');
        }

    };

    //------------- day checkbox functionality


    $("input[type='checkbox']").change(function() {

        $("input[type='checkbox']").each(function(index, element) {
            valid_days[index] = element.checked;
        });

        applyFilters();
    });


    $('.switch input').change(function() {
        if (this.checked) {
            $('.slider-track-high').addClass('flipped');
            $('.slider-track-low').addClass('flipped');
            $('.slider-selection').addClass('flipped');
        } else {
            $('.slider-track-high').removeClass('flipped');
            $('.slider-track-low').removeClass('flipped');
            $('.slider-selection').removeClass('flipped');
        }
        showTime();
    })

    $("#time-slider").on("slideStop", function(slideEvt) {
        //console.log(slideEvt);
        time_range = slideEvt.value;
        applyFilters();
        showTime();
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

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        for (index in searchBoxes) {
            searchBoxes[index].setBounds(map.getBounds());
        }
    });
}


    

// ------------ makes checkboxes animated and fancy
$(document).ready(function() {
    $('input#input_text, textarea#textarea1').characterCounter();
});
