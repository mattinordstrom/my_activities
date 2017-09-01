function init() {

  var goalConfig = {
    MONTHLY_GOAL: 8,
    RUNNING_GOAL: {
      PRIMARY_DISTANCE: 5000, //Running goal: Run 5 km in..
      PRIMARY_TIME: 1800, //..less than 30 min (gives 1 filled star)
      SECONDARY_DISTANCE: 5000, //Secondary goal
      SECONDARY_TIME: 0 //0 = any time
    },
    CYCLING_GOAL: {
      PRIMARY_DISTANCE: 15000,
      PRIMARY_TIME: 3000,
      SECONDARY_DISTANCE: 20000,
      SECONDARY_TIME: 0
    }
  };

  var mainHandler = new MainHandler(goalConfig);
  mainHandler.init();
}
