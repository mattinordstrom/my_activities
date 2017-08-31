var StarGoalHandler = function(runningGoalDistance, runningGoalTime, secondaryRunningGoalDistance, secondaryRunningGoalTime) {
  if(runningGoalTime == 0){
    $("#starGoal").text((runningGoalDistance / 1000)+" km in any time");
  } else {
    $("#starGoal").text((runningGoalDistance / 1000)+" km in less than " + (runningGoalTime / 60).toFixed(2)+" min");
  }

  if(secondaryRunningGoalTime == 0){
    $("#secStarGoal").text((secondaryRunningGoalDistance / 1000)+" km in any time");
  } else {
    $("#secStarGoal").text((secondaryRunningGoalDistance / 1000)+" km in less than " + (secondaryRunningGoalTime / 60).toFixed(2)+" min");
  }
};

StarGoalHandler.prototype.constructor = StarGoalHandler;

StarGoalHandler.prototype.setStarGoalData = function(activitiesData) {
  var runningActivities = $.grep(activitiesData, function(activity){ return activity.type == "Run"; });

  var now = new Date();
  var currentMonth = now.getMonth()+1;
  var currentYear = now.getFullYear();
  var i, runningActivity, starActivitiesThisMonth = [], secStarActivitiesThisMonth = [];

  for(i=0; i<runningActivities.length; i++) {
    runningActivity = runningActivities[i];
    var isCurrentYear = runningActivity.start_date.split('-')[0] == currentYear;
    var isCurrentMonth = isCurrentYear && runningActivity.start_date.split('-')[1] == currentMonth;

    var primaryRunningTimeCompleted = (runningActivity.moving_time < (this.runningGoalTime)) || this.runningGoalTime == 0;
    var secondaryRunningTimeCompleted = (runningActivity.moving_time < (this.secondaryRunningGoalTime)) || this.secondaryRunningGoalTime == 0;
    if((isCurrentYear && isCurrentMonth) && (runningActivity.distance > this.runningGoalDistance) && primaryRunningTimeCompleted) {
      starActivitiesThisMonth.push(runningActivities[i]);
    } else if((isCurrentYear && isCurrentMonth) && (runningActivity.distance > this.secondaryRunningGoalDistance) && secondaryRunningTimeCompleted){
      secStarActivitiesThisMonth.push(runningActivities[i]);
    }
  }

  $("#starsThisMonth").text(starActivitiesThisMonth.length);
  $("#secondaryStarsThisMonth").text(secStarActivitiesThisMonth.length);
}
