function init() {
  var MONTHLY_GOAL = 8;
  var RUNNING_GOAL_M = 5000; //Running goal: Run 5 km in..
  var RUNNING_GOAL_TIME_S = 1800; //..less than 30 min (gives 1 star)

  var activityDataHandler = new ActivityDataHandler(MONTHLY_GOAL, RUNNING_GOAL_M, RUNNING_GOAL_TIME_S);
  activityDataHandler.setActivityData();
}
