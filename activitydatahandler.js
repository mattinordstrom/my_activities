var ActivityDataHandler = function(runningGoalDistance, runningGoalTime, secondaryRunningGoalDistance, secondaryRunningGoalTime) {
  this.runningGoalDistance = runningGoalDistance;
  this.runningGoalTime = runningGoalTime;
  this.secondaryRunningGoalDistance = secondaryRunningGoalDistance;
  this.secondaryRunningGoalTime = secondaryRunningGoalTime;

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
  var i, activityDate, activityDistance, activityDurationMinutes, activityDurationSeconds;

  for(i=4; i>=0; i--) {
    //RUNNING
    if(fiveLatestRunningActivities[i]){
      activityDate = fiveLatestRunningActivities[i].start_date.slice(0,10);
      activityDistance = (fiveLatestRunningActivities[i].distance / 1000).toFixed(2);
      activityDurationSeconds = fiveLatestRunningActivities[i].moving_time % 60;
      activityDurationMinutes = (fiveLatestRunningActivities[i].moving_time - activityDurationSeconds) / 60

      if(activityDurationSeconds.toString().length == 1){
        activityDurationSeconds += "0";
      }

      runningContent += activityDate + ": " + activityDistance + " km in " + activityDurationMinutes + ":" + activityDurationSeconds;

      var primaryRunningTimeCompleted = (fiveLatestRunningActivities[i].moving_time < (this.runningGoalTime)) || this.runningGoalTime == 0;
      var secondaryRunningTimeCompleted = (fiveLatestRunningActivities[i].moving_time < (this.secondaryRunningGoalTime)) || this.secondaryRunningGoalTime == 0;

      if((fiveLatestRunningActivities[i].distance > this.runningGoalDistance) && primaryRunningTimeCompleted){
        runningContent += " <i class='fa fa-star' aria-hidden='true'></i>";
      } else if((fiveLatestRunningActivities[i].distance > this.secondaryRunningGoalDistance) && secondaryRunningTimeCompleted){
        runningContent += " <i class='fa fa-star-o' aria-hidden='true'></i>";
      }
      runningContent += "<br/><br/>";
    }

    //CYCLING
    if(fiveLatestCyclingActivities[i]){
      activityDate = fiveLatestCyclingActivities[i].start_date.slice(0,10);
      activityDistance = (fiveLatestCyclingActivities[i].distance / 1000).toFixed(2);
      activityDurationSeconds = fiveLatestCyclingActivities[i].moving_time % 60;
      activityDurationMinutes = (fiveLatestCyclingActivities[i].moving_time - activityDurationSeconds) / 60

      if(activityDurationSeconds.toString().length == 1){
        activityDurationSeconds += "0";
      }

      cyclingContent += activityDate + ": " + activityDistance + " km in " + activityDurationMinutes + ":" + activityDurationSeconds;
      cyclingContent += "<br/><br/>";
    }
  }
  $("#running_content").html(runningContent);
  $("#cycling_content").html(cyclingContent);
}
