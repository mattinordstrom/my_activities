var MainHandler = function(monthlyGoal, runningGoalDistance, runningGoalTime, secondaryRunningGoalDistance, secondaryRunningGoalTime) {
  this.summaryHandler = new SummaryHandler(monthlyGoal);
  this.starGoalHandler = new StarGoalHandler(runningGoalDistance, runningGoalTime, secondaryRunningGoalDistance, secondaryRunningGoalTime);
  this.activityDataHandler = new ActivityDataHandler(runningGoalDistance, runningGoalTime, secondaryRunningGoalDistance, secondaryRunningGoalTime, this.starGoalHandler);

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

    this.summaryHandler.setSummaryData(athleteData, activitiesData);
    this.starGoalHandler.setStarGoalData(activitiesData);
    this.activityDataHandler.setActivityData(athleteData, activitiesData);

    this.finishLoading();
  }.bind(this));
}

MainHandler.prototype.finishLoading = function() {
  $("#loading").remove();
}
