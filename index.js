var cron = require("node-cron");
var express = require("express");
var { getScheduleFilsList } = require("./utils/fileHandle.js");
var { onDutyHandle } = require("./utils/dutyHandle.js");

app = express();

// second--minute--hour--day of month--month--day of week

function initSchedule() {
  cron.schedule("* * 18 * * *", function () {
    console.log("running a task at 18 clock every day");
    const filePathList = getScheduleFilsList();
    if (!filePathList || filePathList.length == 0) return;
    for (var i = 0; i < filePathList.length; i++) {
      onDutyHandle(filePathList[i]);
    }
  });
}

function getUserList(userStr) {
  return userStr.split(",").filter(item => !!item);
}

exports = module.exports = {
  initSchedule,
  getUserList,
};
