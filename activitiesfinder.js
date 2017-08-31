var ActivitiesFinder = function() {
};

ActivitiesFinder.prototype.constructor = ActivitiesFinder;

ActivitiesFinder.prototype.getActivitiesForSummary = function(activitiesData) {
  var now = new Date();
  var currentMonth = now.getMonth() + 1;
  var currentYear = now.getFullYear();

  var activitiesFiveMonths = this.getActivitiesFiveMonths(activitiesData, currentMonth, currentYear);
  var activitiesTwoYears = this.getActivitiesTwoYears(activitiesData, currentYear);

  var activities = {
      "activities5Months": activitiesFiveMonths,
      "activities2Years": activitiesTwoYears
  };

  return activities;
}

ActivitiesFinder.prototype.getActivitiesFiveMonths = function(activitiesData, currentMonth, currentYear) {
  var activitesFiveMonths = [];

  activitesFiveMonths["activitiesThisMonth"] = $.grep(activitiesData, function(activity){
    var isCurrentYear = activity.start_date.split('-')[0] == currentYear;
    return isCurrentYear && activity.start_date.split('-')[1] == currentMonth;
  });

  activitesFiveMonths["activitiesLastMonth"] = this.getActivitiesInAPreviousMonth(activitiesData, currentMonth, currentYear, 1);
  activitesFiveMonths["activities2MonthsAgo"] = this.getActivitiesInAPreviousMonth(activitiesData, currentMonth, currentYear, 2);
  activitesFiveMonths["activities3MonthsAgo"] = this.getActivitiesInAPreviousMonth(activitiesData, currentMonth, currentYear, 3);
  activitesFiveMonths["activities4MonthsAgo"] = this.getActivitiesInAPreviousMonth(activitiesData, currentMonth, currentYear, 4);

  return activitesFiveMonths;
}

ActivitiesFinder.prototype.getActivitiesTwoYears = function(activitiesData, currentYear) {
  var activitesTwoYears = [];

  activitesTwoYears["activitiesThisYear"] = $.grep(activitiesData, function(activity){
    return activity.start_date.split('-')[0] == currentYear;
  });
  activitesTwoYears["activitiesLastYear"] = $.grep(activitiesData, function(activity){
    return activity.start_date.split('-')[0] == currentYear - 1;
  });

  return activitesTwoYears;
}

ActivitiesFinder.prototype.getActivitiesInAPreviousMonth = function(activitiesData, currentMonth, currentYear, numberOfMonthsBackToCheck) {
  return $.grep(activitiesData, function(activity){
    var checkMonthInCurrentYear = false;
    if((currentMonth - numberOfMonthsBackToCheck) > 0){
      checkMonthInCurrentYear = true;
    }
    var isCurrentYear = activity.start_date.split('-')[0] == currentYear;
    var isLastYear = activity.start_date.split('-')[0] == currentYear-1;
    if(checkMonthInCurrentYear){
      return isCurrentYear && (activity.start_date.split('-')[1] == currentMonth - numberOfMonthsBackToCheck);
    }

    return isLastYear && (activity.start_date.split('-')[1] == 12 - Math.abs(currentMonth - numberOfMonthsBackToCheck));
  });
}
