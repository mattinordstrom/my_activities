var ActivityDataHandler = function(monthlyGoal) {
  this.monthlyGoal = monthlyGoal;

  $(".monthlyGoal").text(monthlyGoal);
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

  this.finishLoading();
}

ActivityDataHandler.prototype.setFiveLatest = function(runningActivities, cyclingActivities) {
  var fiveLatestRunningActivities = runningActivities.splice(runningActivities.length-5,runningActivities.length);
  var fiveLatestCyclingActivities = cyclingActivities.splice(cyclingActivities.length-5,cyclingActivities.length);
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
  var activitiesLastMonth = $.grep(activitiesData, function(activity){
    var isCurrentYear = activity.start_date.split('-')[0] == currentYear;
    return isCurrentYear && activity.start_date.split('-')[1] == currentMonth-1;
  });

  $("#activitiesThisYear").html("This year: " + activitiesThisYear.length + "/" + (this.monthlyGoal*12));
  $("#activitiesLastYear").html("Last year: " + activitiesLastYear.length + "/" + (this.monthlyGoal*12));

  $("#activitiesThisMonth").html("This month: " + activitiesThisMonth.length + "/" + (this.monthlyGoal));
  $("#activitiesLastMonth").html("Last month: " + activitiesLastMonth.length + "/" + (this.monthlyGoal));

  this.setSummaryBar(activitiesThisYear, $('#activitiesThisYearBar'), true);
  this.setSummaryBar(activitiesLastYear, $('#activitiesLastYearBar'), true);
  this.setSummaryBar(activitiesThisMonth, $('#activitiesThisMonthBar'));
  this.setSummaryBar(activitiesLastMonth, $('#activitiesLastMonthBar'));

}

ActivityDataHandler.prototype.setSummaryBar = function(activities, activitiesBarElement, yearActivity) {
  var completedPart = activities.length / (this.monthlyGoal * (yearActivity ? 12 : 1)); //between 0-1
  var barTotalWidth = activitiesBarElement.width();
  var barWidth = completedPart * barTotalWidth;
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
