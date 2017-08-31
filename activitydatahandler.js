var ActivityDataHandler = function(runningGoalDistance, runningGoalTime, secondaryRunningGoalDistance, secondaryRunningGoalTime, starGoalHandler) {
  this.runningGoalDistance = runningGoalDistance;
  this.runningGoalTime = runningGoalTime;
  this.secondaryRunningGoalDistance = secondaryRunningGoalDistance;
  this.secondaryRunningGoalTime = secondaryRunningGoalTime;
  this.starGoalHandler = starGoalHandler;
};

ActivityDataHandler.prototype.constructor = ActivityDataHandler;

ActivityDataHandler.prototype.setActivityData = function(athleteData, activitiesData) {
  $("#bike").text(athleteData.bikes.length > 0 ? athleteData.bikes[0].name : "UNKNOWN");
  $("#shoes").text(athleteData.shoes.length > 0 ? athleteData.shoes[0].name : "UNKNOWN");

  var runningActivities = $.grep(activitiesData, function(activity){ return activity.type == "Run"; });
  var cyclingActivities = $.grep(activitiesData, function(activity){ return activity.type == "Ride"; });

  this.setFiveLatest(runningActivities, cyclingActivities);

}

ActivityDataHandler.prototype.setFiveLatest = function(runningActivities, cyclingActivities) {
  var fiveLatestRunningActivities = runningActivities.length < 5 ? runningActivities : runningActivities.splice(runningActivities.length - 5, runningActivities.length);
  var fiveLatestCyclingActivities = cyclingActivities.length < 5 ? cyclingActivities : cyclingActivities.splice(cyclingActivities.length - 5, cyclingActivities.length);
  var runningContent = "Latest 5 activities: <br/><br/><br/>";
  var cyclingContent = "Latest 5 activities: <br/><br/><br/>";
  var i;

  for(i=4; i>=0; i--) {
    //RUNNING
    if(fiveLatestRunningActivities[i]){
      runningContent += this.getActivityString(fiveLatestRunningActivities[i]);
      runningContent += this.starGoalHandler.getStarContentForRunningActivity(fiveLatestRunningActivities[i]);
      runningContent += "<br/><br/>";
    }

    //CYCLING
    if(fiveLatestCyclingActivities[i]){
      cyclingContent += this.getActivityString(fiveLatestCyclingActivities[i]);
      cyclingContent += "<br/><br/>";
    }
  }
  $("#running_content").html(runningContent);
  $("#cycling_content").html(cyclingContent);
}

ActivityDataHandler.prototype.getActivityString = function(activity) {
  var i, activityDate, activityDistance, activityDurationMinutes, activityDurationSeconds;

  activityDate = activity.start_date.slice(0,10);
  activityDistance = (activity.distance / 1000).toFixed(2);
  activityDurationSeconds = activity.moving_time % 60;
  activityDurationMinutes = (activity.moving_time - activityDurationSeconds) / 60

  if(activityDurationSeconds.toString().length == 1){
    activityDurationSeconds += "0";
  }

  return activityDate + ": " + activityDistance + " km in " + activityDurationMinutes + ":" + activityDurationSeconds;
}
