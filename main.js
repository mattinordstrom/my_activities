function init() {
  var MONTHLY_GOAL = 8;
  var RUNNING_GOAL_M = 5000; //Running goal: Run 5 km in..
  var RUNNING_GOAL_TIME_S = 1800; //..less than 30 min (gives 1 filled star)

  var SEC_RUNNING_GOAL_M = 5000; //Secondary goal
  var SEC_RUNNING_GOAL_TIME_S = 0; //0 = any time

  var mainHandler = new MainHandler(MONTHLY_GOAL, RUNNING_GOAL_M, RUNNING_GOAL_TIME_S, SEC_RUNNING_GOAL_M, SEC_RUNNING_GOAL_TIME_S);
  mainHandler.init();
}
