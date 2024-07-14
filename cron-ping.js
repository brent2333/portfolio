const { fetchGuitars } = require("./utils/amazon");
const cron = require("node-cron");

cron.schedule("* * 23 * *", function () {
  console.log("running task every 5 minutes");
  fetchGuitars();
});
