var StarGoalHandler = function(goalConfig) {
  this.goalConfig = goalConfig;

  this.setInfoInUI(goalConfig["RUNNING_GOAL"], "RUNNING");
  this.setInfoInUI(goalConfig["CYCLING_GOAL"], "CYCLING");
};

StarGoalHandler.prototype.constructor = StarGoalHandler;

StarGoalHandler.prototype.setInfoInUI = function(goals, activityType) {
  if(goals["PRIMARY_TIME"] == 0){
    $("#starGoal"+activityType.toUpperCase()).text((goals["PRIMARY_DISTANCE"] / 1000) + " km in any time");
  } else {
    var activityDurationSeconds = goals["PRIMARY_TIME"] % 60;
    var activityDurationMinutes = (goals["PRIMARY_TIME"] - activityDurationSeconds) / 60;
    if(activityDurationSeconds.toString().length == 1){
      activityDurationSeconds = "0" + activityDurationSeconds;
    }

    $("#starGoal"+activityType.toUpperCase()).text((goals["PRIMARY_DISTANCE"] / 1000) + " km in less than " + activityDurationMinutes + ":" + activityDurationSeconds + " min");
  }

  if(goals["SECONDARY_TIME"] == 0){
    $("#secStarGoal"+activityType.toUpperCase()).text((goals["SECONDARY_DISTANCE"] / 1000) + " km in any time");
  } else {
    var activityDurationSeconds = goals["SECONDARY_TIME"] % 60;
    var activityDurationMinutes = (goals["SECONDARY_TIME"] - activityDurationSeconds) / 60;
    if(activityDurationSeconds.toString().length == 1){
      activityDurationSeconds = "0" + activityDurationSeconds;
    }

    $("#secStarGoal"+activityType.toUpperCase()).text((goals["SECONDARY_DISTANCE"] / 1000) + " km in less than " + activityDurationMinutes + ":" + activityDurationSeconds + " min");
  }
}

StarGoalHandler.prototype.setStarsEarnedThisMonth = function(runningActivities, cyclingActivities) {
  this.setStarsEarnedThisMonthForActivityType(runningActivities, "running");
  this.setStarsEarnedThisMonthForActivityType(cyclingActivities, "cycling");
}

StarGoalHandler.prototype.setStarsEarnedThisMonthForActivityType = function(activities, activityType) {
  var goals = this.goalConfig[activityType.toUpperCase() + "_GOAL"];

  var now = new Date();
  var currentMonth = now.getMonth() + 1;
  var currentYear = now.getFullYear();
  var i, activity, starActivitiesThisMonth = [], secStarActivitiesThisMonth = [];

  for(i = 0; i < activities.length; i++) {
    activity = activities[i];
    var isCurrentYear = activity.start_date.split('-')[0] == currentYear;
    var isCurrentMonth = isCurrentYear && activity.start_date.split('-')[1] == currentMonth;

    var primaryTimeCompleted = (activity.moving_time < goals["PRIMARY_TIME"]) || goals["PRIMARY_TIME"] == 0;
    var secondaryTimeCompleted = (activity.moving_time < goals["SECONDARY_TIME"]) || goals["SECONDARY_TIME"] == 0;
    if((isCurrentYear && isCurrentMonth) && (activity.distance >= goals["PRIMARY_DISTANCE"]) && primaryTimeCompleted) {
      starActivitiesThisMonth.push(activity);
    } else if((isCurrentYear && isCurrentMonth) && (activity.distance >= goals["SECONDARY_DISTANCE"]) && secondaryTimeCompleted){
      secStarActivitiesThisMonth.push(activity);
    }
  }

  $("#starsThisMonth"+activityType.toUpperCase()).text(starActivitiesThisMonth.length);
  $("#secondaryStarsThisMonth"+activityType.toUpperCase()).text(secStarActivitiesThisMonth.length);
}

StarGoalHandler.prototype.getStarContentForRunningActivity = function(activity, activityType) {
  var goals = this.goalConfig[activityType.toUpperCase() + "_GOAL"];

  var primaryTimeCompleted = (activity.moving_time < goals["PRIMARY_TIME"]) || goals["PRIMARY_TIME"] == 0;
  var secondaryTimeCompleted = (activity.moving_time < goals["SECONDARY_TIME"]) || goals["SECONDARY_TIME"] == 0;

  if((activity.distance >= goals["PRIMARY_DISTANCE"]) && primaryTimeCompleted){
    return " <i class='fa fa-star' aria-hidden='true'></i>";
  } else if((activity.distance >= goals["SECONDARY_DISTANCE"]) && secondaryTimeCompleted){
    return " <i class='fa fa-star-o' aria-hidden='true'></i>";
  }

  return "";
}
