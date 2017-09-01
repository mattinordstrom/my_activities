var MainHandler = function(goalConfig) {
  this.summaryHandler = new SummaryHandler(goalConfig["MONTHLY_GOAL"]);
  this.starGoalHandler = new StarGoalHandler(goalConfig);
  this.activityDataHandler = new ActivityDataHandler(this.starGoalHandler);

};

MainHandler.prototype.constructor = MainHandler;

MainHandler.prototype.init = function() {
  $.getJSON("strava_data.php", function(data) {
    var athleteData = data.athlete;
    var activitiesData = data.activities;

    if(data.errors){
      $('#loadingDivContent').html("Error fetching data <br />" + data.errors[0].message + ": " + data.errors[0].errors[0].code + " " + data.errors[0].errors[0].field);
      return;
    }

    var runningActivities = $.grep(activitiesData, function(activity){ return activity.type == "Run"; });
    var cyclingActivities = $.grep(activitiesData, function(activity){ return activity.type == "Ride"; });

    this.summaryHandler.setSummaryData(athleteData, activitiesData);
    this.starGoalHandler.setStarsEarnedThisMonth(runningActivities, cyclingActivities);
    this.activityDataHandler.setActivityData(athleteData, runningActivities, cyclingActivities);

    this.finishLoading();
  }.bind(this));
}

MainHandler.prototype.finishLoading = function() {
  $("#loading").remove();
}
