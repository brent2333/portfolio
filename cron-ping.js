const { fetchGuitars } = require("./utils/amazon");
const cron = require("node-cron");

cron.schedule("* * * * *", function () {
  console.log("running task every 5 minutes");
  fetchGuitars();
});
