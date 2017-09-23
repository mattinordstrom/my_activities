var SummaryHandler = function(monthlyGoal) {
  this.monthTitles = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  this.activitiesFinder = new ActivitiesFinder();

  this.monthlyGoal = monthlyGoal;

  $(".monthlyGoal").text(monthlyGoal);
};

SummaryHandler.prototype.constructor = SummaryHandler;

SummaryHandler.prototype.setSummaryData = function(athleteData, activitiesData) {
  $("#summaryName").text(athleteData.firstname + " " + athleteData.lastname);

  var now = new Date();
  var currentDate = now.getDate();
  var currentMonth = now.getMonth() + 1;
  var currentYear = now.getFullYear();

  var activities = this.activitiesFinder.getActivitiesForSummary(activitiesData);
  var activitesYears = activities["activities2Years"];
  var activitesMonths = activities["activities5Months"];

  $("#activities2MonthsAgo").html(
    this.getPreviousMonthsMonthTitle(currentMonth, currentYear, 2) + " " +
    this.getPreviousMonthsYearTitle(currentMonth, currentYear, 2)
  );
  $("#activities3MonthsAgo").html(
    this.getPreviousMonthsMonthTitle(currentMonth, currentYear, 3) + " " +
    this.getPreviousMonthsYearTitle(currentMonth, currentYear, 3)
  );
  $("#activities4MonthsAgo").html(
    this.getPreviousMonthsMonthTitle(currentMonth, currentYear, 4) + " " +
    this.getPreviousMonthsYearTitle(currentMonth, currentYear, 4)
  );

  this.setSummaryBars(activitesYears, activitesMonths);
}

SummaryHandler.prototype.getPreviousMonthsYearTitle = function(currentMonth, currentYear, numberOfMonthsBack) {
  var isCurrentYear = (currentMonth - numberOfMonthsBack) > 0;
  return isCurrentYear ? currentYear : currentYear - 1;
}

SummaryHandler.prototype.getPreviousMonthsMonthTitle = function(currentMonth, currentYear, numberOfMonthsBack) {
  var isCurrentYear = (currentMonth-numberOfMonthsBack) > 0;
  return isCurrentYear ? this.monthTitles[currentMonth - numberOfMonthsBack - 1] : this.monthTitles[12 - Math.abs(currentMonth - numberOfMonthsBack) - 1];
}

SummaryHandler.prototype.setSummaryBars = function(activitesYears, activitesMonths) {
  this.setSummaryBar("activitiesThisYear", activitesYears, 12);
  this.setSummaryBar("activitiesLastYear", activitesYears, 12);
  this.setSummaryBar("activitiesThisMonth", activitesMonths, 1);
  this.setSummaryBar("activitiesLastMonth", activitesMonths, 1);
  this.setSummaryBar("activities2MonthsAgo", activitesMonths, 1);
  this.setSummaryBar("activities3MonthsAgo", activitesMonths, 1);
  this.setSummaryBar("activities4MonthsAgo", activitesMonths, 1);
}

SummaryHandler.prototype.setSummaryBar = function(activitiesId, activities, numberOfMonths) {
  var activities = activities[activitiesId];
  var activitiesBarElement = $('#'+activitiesId+'Bar');
  var completedPart = activities.length / (this.monthlyGoal * numberOfMonths); //between 0-1
  if(completedPart > 1){
    completedPart = 1;
  }

  var barColor = this.getBarColor(completedPart);

  activitiesBarElement.append(
    '<div style="position:relative; top:' + (100-(completedPart*100)) + '%; height:' + (completedPart*100) + '%; background-color:' + barColor + '">' +
      '<div style="height:25px; top:-25px; position:relative;" id="'+activitiesId+'Count"></div>' +
    '</div>'
  );

  $('#'+activitiesId+'Count').html(activities.length);
}

SummaryHandler.prototype.getBarColor = function(completedPart) {
  if(completedPart < 0.5){
    return "#ed3704"; //red
  } else if(completedPart < 0.8){
    return "#f2cd13"; //yellow
  }
  return "#4fbc73"; //green
}
