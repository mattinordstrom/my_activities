var ActivityDataHandler = function(monthlyGoal) {
  this.monthlyGoal = monthlyGoal;
  this.setMonthlyGoalInUI();
};

ActivityDataHandler.prototype.constructor = ActivityDataHandler;

ActivityDataHandler.prototype.setActivityData = function() {
  $.getJSON("strava_data.php", function(data) {
    var athleteData = data.athlete;
    var activitiesData = data.activities;

    var runningActivities = $.grep(activitiesData, function(e){ return e.type == "Run"; });
    var cyclingActivities = $.grep(activitiesData, function(e){ return e.type == "Ride"; });

    var lastRunningActivity = runningActivities[runningActivities.length-1].start_date;
    var lastCyclingActivity = cyclingActivities[cyclingActivities.length-1].start_date;

    $("#summaryName").text(athleteData.firstname + " " + athleteData.lastname);
    $("#bike").text(athleteData.bikes[0].name);
    $("#shoes").text(athleteData.shoes[0].name);

    $("#running_content").html("Last activity: <br/>" + lastRunningActivity.slice(0,10));
    $("#cycling_content").html("Last activity: <br/>" + lastCyclingActivity.slice(0,10));
  });
}

ActivityDataHandler.prototype.setMonthlyGoalInUI = function() {
  $("#monthlyGoal").text(this.monthlyGoal);
}
