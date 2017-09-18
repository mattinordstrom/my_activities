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
  var runningContent = "<br/><strong>LATEST 5 ACTIVITIES</strong> <br/><br/><br/>";
  var cyclingContent = "<br/><strong>LATEST 5 ACTIVITIES</strong> <br/><br/><br/>";
  var i;

  for(i=4; i>=0; i--) {
    //RUNNING
    if(fiveLatestRunningActivities[i]){
      runningContent += this.getActivityString(fiveLatestRunningActivities[i]);
      runningContent += this.starGoalHandler.getStarContentForRunningActivity(fiveLatestRunningActivities[i], "running");
      if(fiveLatestRunningActivities[i].trainer){
          runningContent += "<span style='font-size: 10pt; font-weight: bolder'>&nbsp;T</span>";
      }
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
  var i, activityDate, activityDistance, activityDuration;

  activityDate = activity.start_date.slice(0,10);
  activityDistance = this.getFormattedActivityDistance(activity.distance);
  activityDuration = this.getFormattedActivityDuration(activity.moving_time);

  return activityDate + ": <strong>" + activityDistance + " km</strong> in " + activityDuration + " min";
}

ActivityDataHandler.prototype.getFormattedActivityDuration = function(duration) {
  var activityDurationMinutes, activityDurationSeconds;

  activityDurationSeconds = duration % 60;
  activityDurationMinutes = (duration - activityDurationSeconds) / 60

  if(activityDurationSeconds.toString().length == 1){
    activityDurationSeconds = "0" + activityDurationSeconds;
  }

  return activityDurationMinutes + ":" + activityDurationSeconds;
}

ActivityDataHandler.prototype.getFormattedActivityDistance = function(distance) {
  var activityFullDistanceString = (distance / 1000).toString();

  if(activityFullDistanceString.indexOf(".") == -1){
    return activityFullDistanceString + ".00";
  }

  return activityFullDistanceString.slice(0, (activityFullDistanceString.indexOf("."))+3);
}
