const axios = require("axios");
const notifier = require("node-notifier");
const PACKAGE_JSON = require('../package.json');

const urlToCheck = PACKAGE_JSON.config.urlToCheck;
const CHECK_INTERVAL = 60 * 1000; // Check every minute

let downtimeStart = null;
let totalDowntime = 0;

const checkUrl = async () => {
  try {
    const response = await axios.get(urlToCheck);
    if (response.status === 200) {
      console.log(`${urlToCheck} is responding with a 200 status code.`);

      if (downtimeStart) {
        const currentDowntime = Date.now() - downtimeStart;
        totalDowntime += currentDowntime;
        downtimeStart = null;
        console.log(
          `Downtime resolved. Current downtime: ${currentDowntime} ms, Total downtime: ${totalDowntime} ms`
        );

        notifier.notify({
          title: "URL Check",
          message: `${urlToCheck} is back up! Downtime: ${currentDowntime} ms`,
        });
      }
    } else {
      throw new Error(`Non-200 status code: ${response.status}`);
    }
  } catch (error) {
    if (!downtimeStart) {
      downtimeStart = Date.now();
    }
    console.error(`Error checking ${urlToCheck}:`, error.message);
    notifier.notify({
      title: "URL Check",
      message: `Error checking ${urlToCheck}: ${error.message}`,
    });
  }
};

const startCheckingUrl = () => {
  checkUrl();
  setInterval(checkUrl, CHECK_INTERVAL);
};

module.exports = {
  startCheckingUrl,
  getTotalDowntime: () => totalDowntime,
  getCurrentDowntime: () => (downtimeStart ? Date.now() - downtimeStart : 0),
};
