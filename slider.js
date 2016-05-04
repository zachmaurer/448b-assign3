$(function() {
  $("#year-slider .slider").noUiSlider({
    start: 8,
    step: 1,
    connect: "lower",
    range: {
      'min': 0,
      'max': 10
    },
    serialization: {
      format: {
        decimals: 0
      }
    }
  });
  
  $('#year-slider .slider').on('change', function(){
		highlightLabel($(this).val());
	});
  
  $('#year-slider .slider').on('slide', function(){
    highlightLabel($(this).val());
  });
  
  $("#year-slider .slider-labels").on("click", "li", function() { 
    $('#year-slider .slider').val($(this).index());
    highlightLabel($(this).index());
  });
  
  function highlightLabel($this) {
    $('#year-slider .slider-labels li').removeClass('active');
    var index = parseInt($this) + 1;
    var selector = '#year-slider .slider-labels li:nth-child(' + index + ')';
    $(selector).addClass('active');
  }
  
});