function getData () {
  $.getJSON( "strava_data.php", function( data ) {
    console.log(data);
  });
}
