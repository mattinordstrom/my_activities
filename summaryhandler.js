var SummaryHandler = function(monthlyGoal) {
  this.monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  this.monthlyGoal = monthlyGoal;

  $(".monthlyGoal").text(monthlyGoal);

};

SummaryHandler.prototype.constructor = SummaryHandler;

SummaryHandler.prototype.setSummaryData = function(athleteData, activitiesData) {
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

SummaryHandler.prototype.getPreviousMonthsYearTitle = function(currentMonth, currentYear, numberOfMonthsBack) {
  return ((currentMonth-numberOfMonthsBack) > 0) ? currentYear : currentYear-1;
}

SummaryHandler.prototype.getPreviousMonthsMonthTitle = function(currentMonth, currentYear, numberOfMonthsBack) {
  return ((currentMonth-numberOfMonthsBack) > 0) ? this.monthNames[currentMonth-numberOfMonthsBack-1] : this.monthNames[12-Math.abs(currentMonth-numberOfMonthsBack)-1];
}

SummaryHandler.prototype.getActivitiesInAPreviousMonth = function(activitiesData, currentMonth, currentYear, numberOfMonthsBackToCheck) {
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

SummaryHandler.prototype.setSummaryBar = function(activities, activitiesBarElement, yearActivity) {
  var completedPart = activities.length / (this.monthlyGoal * (yearActivity ? 12 : 1)); //between 0-1
  var barTotalWidth = activitiesBarElement.width();
  var barWidth = completedPart * barTotalWidth;
  barWidth = barWidth > barTotalWidth ? barTotalWidth : barWidth;

  var barColor = this.getBarColor(completedPart);

  activitiesBarElement.append('<div style="width:'+barWidth+'px; height:'+activitiesBarElement.height()+'px; background-color:'+barColor+'"></div>')
}

SummaryHandler.prototype.getBarColor = function(completedPart) {
  if(completedPart < 0.5){
    return "#ed3704"; //red
  } else if(completedPart < 0.8){
    return "#e9ed25"; //yellow
  }
  return "#19e812"; //green
}
