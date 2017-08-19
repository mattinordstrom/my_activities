var ActivityDataHandler = function(monthlyGoal) {
  this.monthlyGoal = monthlyGoal;
  this.setMonthlyGoalInUI();
};

ActivityDataHandler.prototype.constructor = ActivityDataHandler;

ActivityDataHandler.prototype.setActivityData = function() {
  $.getJSON("strava_data.php", function(data) {
    $("#summaryName").text(data.athlete.firstname + " " + data.athlete.lastname);
    $("#bike").text(data.athlete.bikes[0].name);
    $("#shoes").text(data.athlete.shoes[0].name);
  });
}

ActivityDataHandler.prototype.setMonthlyGoalInUI = function() {
  $("#monthlyGoal").text(this.monthlyGoal);
}
