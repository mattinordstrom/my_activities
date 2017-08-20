
var ActivityDataHandler = function(monthlyGoal, runningGoalDistance, runningGoalTime) {
  this.monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  this.monthlyGoal = monthlyGoal;
  this.runningGoalDistance = runningGoalDistance;
  this.runningGoalTime = runningGoalTime;

  $(".monthlyGoal").text(monthlyGoal);
  $("#starMinGoal").text(runningGoalTime / 60);
  $("#starKmGoal").text(runningGoalDistance / 1000);
};

ActivityDataHandler.prototype.constructor = ActivityDataHandler;

ActivityDataHandler.prototype.setActivityData = function() {
  $.getJSON("strava_data.php", function(data) {
    var athleteData = data.athlete;
    var activitiesData = data.activities;

    this.updateUIWithFetchedData(athleteData, activitiesData);
  }.bind(this));
}

ActivityDataHandler.prototype.updateUIWithFetchedData = function(athleteData, activitiesData) {
  var runningActivities = $.grep(activitiesData, function(activity){ return activity.type == "Run"; });
  var cyclingActivities = $.grep(activitiesData, function(activity){ return activity.type == "Ride"; });

  this.setSummaryData(athleteData, activitiesData);

  $("#bike").text(athleteData.bikes[0].name);
  $("#shoes").text(athleteData.shoes[0].name);

  this.setFiveLatest(runningActivities, cyclingActivities);

  this.handleStars(runningActivities);

  this.finishLoading();
}

ActivityDataHandler.prototype.handleStars = function(runningActivities) {
  var now = new Date();
  var currentMonth = now.getMonth()+1;
  var currentYear = now.getFullYear();

  var starActivitiesThisMonth = $.grep(runningActivities, function(runningActivity){
    var isCurrentYear = runningActivity.start_date.split('-')[0] == currentYear;
    var isCurrentMonth = isCurrentYear && runningActivity.start_date.split('-')[1] == currentMonth;

    return (isCurrentYear && isCurrentMonth) && (runningActivity.distance > this.runningGoalDistance) && (runningActivity.moving_time < (this.runningGoalTime));
  }.bind(this));

  $("#starsThisMonth").text(starActivitiesThisMonth.length);
}

ActivityDataHandler.prototype.setFiveLatest = function(runningActivities, cyclingActivities) {
  var fiveLatestRunningActivities = runningActivities.length < 5 ? runningActivities : runningActivities.splice(runningActivities.length-5,runningActivities.length);
  var fiveLatestCyclingActivities = cyclingActivities.length < 5 ? cyclingActivities : cyclingActivities.splice(cyclingActivities.length-5,cyclingActivities.length);
  var runningContent = "Latest 5 activities: <br/><br/><br/>";
  var cyclingContent = "Latest 5 activities: <br/><br/><br/>";
  var i, activityDate, activityDistance, activityDurationMinutes, activityDurationSeconds;

  for(i=4; i>=0; i--) {
    if(fiveLatestRunningActivities[i]){
      activityDate = fiveLatestRunningActivities[i].start_date.slice(0,10);
      activityDistance = (fiveLatestRunningActivities[i].distance / 1000).toFixed(2);
      activityDurationSeconds = fiveLatestRunningActivities[i].moving_time % 60;
      activityDurationMinutes = (fiveLatestRunningActivities[i].moving_time - activityDurationSeconds) / 60

      if(activityDurationSeconds == 0){
        activityDurationSeconds += "0";
      }

      runningContent += activityDate + ": " + activityDistance + " km in " + activityDurationMinutes + ":" + activityDurationSeconds;
      if((fiveLatestRunningActivities[i].distance > this.runningGoalDistance) && (fiveLatestRunningActivities[i].moving_time < (this.runningGoalTime))){
        runningContent += " <i class='fa fa-star-o' aria-hidden='true'></i>";
      }
      runningContent += "<br/><br/>";
    }

    if(fiveLatestCyclingActivities[i]){
      activityDate = fiveLatestCyclingActivities[i].start_date.slice(0,10);
      activityDistance = (fiveLatestCyclingActivities[i].distance / 1000).toFixed(2);
      activityDurationSeconds = fiveLatestCyclingActivities[i].moving_time % 60;
      activityDurationMinutes = (fiveLatestCyclingActivities[i].moving_time - activityDurationSeconds) / 60

      if(activityDurationSeconds == 0){
        activityDurationSeconds += "0";
      }

      cyclingContent += activityDate + ": " + activityDistance + " km in " + activityDurationMinutes + ":" + activityDurationSeconds;
      cyclingContent += "<br/><br/>";
    }
  }
  $("#running_content").html(runningContent);
  $("#cycling_content").html(cyclingContent);
}

ActivityDataHandler.prototype.setSummaryData = function(athleteData, activitiesData) {
  $("#summaryName").text(athleteData.firstname + " " + athleteData.lastname);

  var now = new Date();
  var currentDate = now.getDate();
  var currentMonth = now.getMonth()+1;
  var currentYear = now.getFullYear();

  var activitiesThisYear = $.grep(activitiesData, function(activity){
    return activity.start_date.split('-')[0] == currentYear;
  });
  var activitiesLastYear = $.grep(activitiesData, function(activity){
    return activity.start_date.split('-')[0] == currentYear-1;
  });

  var activitiesThisMonth = $.grep(activitiesData, function(activity){
    var isCurrentYear = activity.start_date.split('-')[0] == currentYear;
    return isCurrentYear && activity.start_date.split('-')[1] == currentMonth;
  });

  var activitiesLastMonth = this.getActivitiesInAPreviousMonth(activitiesData, currentMonth, currentYear, 1);
  var activities2MonthsAgo = this.getActivitiesInAPreviousMonth(activitiesData, currentMonth, currentYear, 2);
  var activities3MonthsAgo = this.getActivitiesInAPreviousMonth(activitiesData, currentMonth, currentYear, 3);
  var activities4MonthsAgo = this.getActivitiesInAPreviousMonth(activitiesData, currentMonth, currentYear, 4);

  $("#activitiesThisYear").html("This year: " + activitiesThisYear.length + "/" + (this.monthlyGoal*12));
  $("#activitiesLastYear").html("Last year: " + activitiesLastYear.length + "/" + (this.monthlyGoal*12));

  $("#activitiesThisMonth").html("This month: " + activitiesThisMonth.length + "/" + (this.monthlyGoal));
  $("#activitiesLastMonth").html("Last month: " + activitiesLastMonth.length + "/" + (this.monthlyGoal));
  $("#activities2MonthsAgo").html(
    this.getPreviousMonthsMonthTitle(currentMonth, currentYear, 2) + " " +
    this.getPreviousMonthsYearTitle(currentMonth, currentYear, 2) + ": " +
    activities2MonthsAgo.length + "/" + (this.monthlyGoal)
  );
  $("#activities3MonthsAgo").html(
    this.getPreviousMonthsMonthTitle(currentMonth, currentYear, 3) + " " +
    this.getPreviousMonthsYearTitle(currentMonth, currentYear, 3) + ": " +
    activities3MonthsAgo.length + "/" + (this.monthlyGoal)
  );
  $("#activities4MonthsAgo").html(
    this.getPreviousMonthsMonthTitle(currentMonth, currentYear, 4) + " " +
    this.getPreviousMonthsYearTitle(currentMonth, currentYear, 4) + ": " +
    activities4MonthsAgo.length + "/" + (this.monthlyGoal)
  );

  this.setSummaryBar(activitiesThisYear, $('#activitiesThisYearBar'), true);
  this.setSummaryBar(activitiesLastYear, $('#activitiesLastYearBar'), true);
  this.setSummaryBar(activitiesThisMonth, $('#activitiesThisMonthBar'));
  this.setSummaryBar(activitiesLastMonth, $('#activitiesLastMonthBar'));
  this.setSummaryBar(activities2MonthsAgo, $('#activities2MonthsAgoBar'));
  this.setSummaryBar(activities3MonthsAgo, $('#activities3MonthsAgoBar'));
  this.setSummaryBar(activities4MonthsAgo, $('#activities4MonthsAgoBar'));

}

ActivityDataHandler.prototype.getPreviousMonthsYearTitle = function(currentMonth, currentYear, numberOfMonthsBack) {
  return ((currentMonth-numberOfMonthsBack) > 0) ? currentYear : currentYear-1;
}

ActivityDataHandler.prototype.getPreviousMonthsMonthTitle = function(currentMonth, currentYear, numberOfMonthsBack) {
  return ((currentMonth-numberOfMonthsBack) > 0) ? this.monthNames[currentMonth-numberOfMonthsBack-1] : this.monthNames[12-Math.abs(currentMonth-numberOfMonthsBack)-1];
}

ActivityDataHandler.prototype.getActivitiesInAPreviousMonth = function(activitiesData, currentMonth, currentYear, numberOfMonthsBackToCheck) {
  return $.grep(activitiesData, function(activity){
    var checkMonthInCurrentYear = false;
    if((currentMonth - numberOfMonthsBackToCheck) > 0){
      checkMonthInCurrentYear = true;
    }
    var isCurrentYear = activity.start_date.split('-')[0] == currentYear;
    var isLastYear = activity.start_date.split('-')[0] == currentYear-1;
    if(checkMonthInCurrentYear){
      return isCurrentYear && (activity.start_date.split('-')[1] == currentMonth-numberOfMonthsBackToCheck);
    } else {
      return isLastYear && (activity.start_date.split('-')[1] == 12-Math.abs(currentMonth-numberOfMonthsBackToCheck));
    }
  });
}

ActivityDataHandler.prototype.setSummaryBar = function(activities, activitiesBarElement, yearActivity) {
  var completedPart = activities.length / (this.monthlyGoal * (yearActivity ? 12 : 1)); //between 0-1
  var barTotalWidth = activitiesBarElement.width();
  var barWidth = completedPart * barTotalWidth;
  barWidth = barWidth > barTotalWidth ? barTotalWidth : barWidth;

  var barColor = this.getBarColor(completedPart);

  activitiesBarElement.append('<div style="width:'+barWidth+'px; height:'+activitiesBarElement.height()+'px; background-color:'+barColor+'"></div>')
}

ActivityDataHandler.prototype.getBarColor = function(completedPart) {
  if(completedPart < 0.5){
    return "#ed3704"; //red
  } else if(completedPart < 0.8){
    return "#e9ed25"; //yellow
  }
  return "#19e812"; //green
}

ActivityDataHandler.prototype.finishLoading = function() {
  $("#loading").remove();
}
