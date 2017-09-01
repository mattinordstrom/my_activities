var ActivityDataHandler = function(starGoalHandler) {
  this.starGoalHandler = starGoalHandler;
};

ActivityDataHandler.prototype.constructor = ActivityDataHandler;

ActivityDataHandler.prototype.setActivityData = function(athleteData, runningActivities, cyclingActivities) {
  $("#bike").text(athleteData.bikes.length > 0 ? athleteData.bikes[0].name : "UNKNOWN");
  $("#shoes").text(athleteData.shoes.length > 0 ? athleteData.shoes[0].name : "UNKNOWN");

  this.setFiveLatest(runningActivities, cyclingActivities);

}

ActivityDataHandler.prototype.setFiveLatest = function(runningActivities, cyclingActivities) {
  var fiveLatestRunningActivities = runningActivities.length < 5 ? runningActivities : runningActivities.splice(runningActivities.length - 5, runningActivities.length);
  var fiveLatestCyclingActivities = cyclingActivities.length < 5 ? cyclingActivities : cyclingActivities.splice(cyclingActivities.length - 5, cyclingActivities.length);
  var runningContent = "<strong>Latest 5 activities</strong> <br/><br/><br/>";
  var cyclingContent = "<strong>Latest 5 activities</strong> <br/><br/><br/>";
  var i;

  for(i=4; i>=0; i--) {
    //RUNNING
    if(fiveLatestRunningActivities[i]){
      runningContent += this.getActivityString(fiveLatestRunningActivities[i]);
      runningContent += this.starGoalHandler.getStarContentForRunningActivity(fiveLatestRunningActivities[i], "running");
      runningContent += "<br/><br/>";
    }

    //CYCLING
    if(fiveLatestCyclingActivities[i]){
      cyclingContent += this.getActivityString(fiveLatestCyclingActivities[i]);
      cyclingContent += this.starGoalHandler.getStarContentForRunningActivity(fiveLatestCyclingActivities[i], "cycling");
      cyclingContent += "<br/><br/>";
    }
  }
  $("#running_content").html(runningContent);
  $("#cycling_content").html(cyclingContent);
}

ActivityDataHandler.prototype.getActivityString = function(activity) {
  var i, activityDate, activityFullDistanceString, activityDistance, activityDurationMinutes, activityDurationSeconds;

  activityDate = activity.start_date.slice(0,10);
  activityFullDistanceString = (activity.distance / 1000).toString();
  activityDistance = activityFullDistanceString.slice(0, (activityFullDistanceString.indexOf("."))+3);
  activityDurationSeconds = activity.moving_time % 60;
  activityDurationMinutes = (activity.moving_time - activityDurationSeconds) / 60

  if(activityDurationSeconds.toString().length == 1){
    activityDurationSeconds = "0" + activityDurationSeconds;
  }

  return activityDate + ": <strong>" + activityDistance + " km</strong> in " + activityDurationMinutes + ":" + activityDurationSeconds + " min";
}
