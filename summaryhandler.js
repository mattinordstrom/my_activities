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

  $("#activitiesThisYear").html("This year: " + activitesYears["activitiesThisYear"].length + "/" + (this.monthlyGoal*12));
  $("#activitiesLastYear").html("Last year: " + activitesYears["activitiesLastYear"].length + "/" + (this.monthlyGoal*12));

  $("#activitiesThisMonth").html("This month: " + activitesMonths["activitiesThisMonth"].length + "/" + (this.monthlyGoal));
  $("#activitiesLastMonth").html("Last month: " + activitesMonths["activitiesLastMonth"].length + "/" + (this.monthlyGoal));
  $("#activities2MonthsAgo").html(
    this.getPreviousMonthsMonthTitle(currentMonth, currentYear, 2) + " " +
    this.getPreviousMonthsYearTitle(currentMonth, currentYear, 2) + ": " +
    activitesMonths["activities2MonthsAgo"].length + "/" + (this.monthlyGoal)
  );
  $("#activities3MonthsAgo").html(
    this.getPreviousMonthsMonthTitle(currentMonth, currentYear, 3) + " " +
    this.getPreviousMonthsYearTitle(currentMonth, currentYear, 3) + ": " +
    activitesMonths["activities3MonthsAgo"].length + "/" + (this.monthlyGoal)
  );
  $("#activities4MonthsAgo").html(
    this.getPreviousMonthsMonthTitle(currentMonth, currentYear, 4) + " " +
    this.getPreviousMonthsYearTitle(currentMonth, currentYear, 4) + ": " +
    activitesMonths["activities4MonthsAgo"].length + "/" + (this.monthlyGoal)
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
  this.setSummaryBar(activitesYears["activitiesThisYear"], $('#activitiesThisYearBar'), 12);
  this.setSummaryBar(activitesYears["activitiesLastYear"], $('#activitiesLastYearBar'), 12);
  this.setSummaryBar(activitesMonths["activitiesThisMonth"], $('#activitiesThisMonthBar'), 1);
  this.setSummaryBar(activitesMonths["activitiesLastMonth"], $('#activitiesLastMonthBar'), 1);
  this.setSummaryBar(activitesMonths["activities2MonthsAgo"], $('#activities2MonthsAgoBar'), 1);
  this.setSummaryBar(activitesMonths["activities3MonthsAgo"], $('#activities3MonthsAgoBar'), 1);
  this.setSummaryBar(activitesMonths["activities4MonthsAgo"], $('#activities4MonthsAgoBar'), 1);
}

SummaryHandler.prototype.setSummaryBar = function(activities, activitiesBarElement, numberOfMonths) {
  var completedPart = activities.length / (this.monthlyGoal * numberOfMonths); //between 0-1
  var barTotalWidth = activitiesBarElement.width();
  var barWidth = completedPart * barTotalWidth;
  barWidth = (barWidth > barTotalWidth) ? barTotalWidth : barWidth;

  var barColor = this.getBarColor(completedPart);

  activitiesBarElement.append('<div style="width:' + barWidth + 'px; height:' + activitiesBarElement.height() + 'px; background-color:' + barColor + '"></div>')
}

SummaryHandler.prototype.getBarColor = function(completedPart) {
  if(completedPart < 0.5){
    return "#ed3704"; //red
  } else if(completedPart < 0.8){
    return "#f2cd13"; //yellow
  }
  return "#4fbc73"; //green
}
