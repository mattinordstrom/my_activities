var ActivityDataHandler = function(monthlyGoal) {
  this.monthlyGoal = monthlyGoal;

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
      activityDistance = (fiveLatestRunningActivities[i].distance / 1000).toFixed(1);
      activityDurationSeconds = fiveLatestRunningActivities[i].moving_time % 60;
      activityDurationMinutes = (fiveLatestRunningActivities[i].moving_time - activityDurationSeconds) / 60

      runningContent += activityDate + ": " + activityDistance + "km in " + activityDurationMinutes + ":" + activityDurationSeconds;
      runningContent += "<br/><br/>";
    }

    if(fiveLatestCyclingActivities[i]){
      activityDate = fiveLatestCyclingActivities[i].start_date.slice(0,10);
      activityDistance = (fiveLatestCyclingActivities[i].distance / 1000).toFixed(1);
      activityDurationSeconds = fiveLatestCyclingActivities[i].moving_time % 60;
      activityDurationMinutes = (fiveLatestCyclingActivities[i].moving_time - activityDurationSeconds) / 60

      cyclingContent += activityDate + ": " + activityDistance + "km in " + activityDurationMinutes + ":" + activityDurationSeconds;
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

  $("#activitiesThisYear").html("Total activities this year: " + activitiesThisYear.length + "/" + (this.monthlyGoal*12));
  $("#activitiesLastYear").html("Total activities last year: " + activitiesLastYear.length + "/" + (this.monthlyGoal*12));

  $("#activitiesThisMonth").html("Total activities this month: " + activitiesThisMonth.length + "/" + (this.monthlyGoal));
  $("#activitiesLastMonth").html("Total activities last month: " + activitiesLastMonth.length + "/" + (this.monthlyGoal));
}

ActivityDataHandler.prototype.finishLoading = function() {
  $("#loading").remove();
}
