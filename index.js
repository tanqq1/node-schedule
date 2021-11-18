var cron = require("node-cron");
var express = require("express");
var fs = require("fs");
var path = require("path");
var { getScheduleFilsList } = require("./utils/fileHandle.js");
var { onDutyHandle } = require("./utils/dutyHandle.js");
var { getEightDayList } = require("./utils/dateHandle.js");

app = express();

// second--minute--hour--day of month--month--day of week

exports = module.exports = {};

exports.createSchedule = createSchedule;

// 每天下午5点请求
cron.schedule("* * 17 * * *", function () {
  getEightDayList();
});

function createSchedule(filePath) {
  cron.schedule("* * 18 * * *", function () {
    console.log("running a task at 18 clock every day");
    const filePathList = getScheduleFilsList();
    if (!filePathList || filePathList.length == 0) return;
    // 如果非工作日，不往下执行
    // if (!isWorkday(dayjs())) return
    for (var i = 0; i < filePathList.length; i++) {
      onDutyHandle(filePathList[i]);
    }
  });
}

function handleFileJson(fileStr) {
  var str = fileStr.substring(1, fileStr.length - 2);
  var str1 = str.replace(/\"/g, "").split(",");
  var bodyParams = {};
  str1.forEach(item => {
    var str2 = item.split(":");
    bodyParams[str2[0]] = str2[1];
  });
  return bodyParams;
}

function getUserList(userStr) {
  return userStr.split(",").filter(item => !!item);
}

exports.getUserList = getUserList;

function addSchedule() {
  cron.schedule("1,2,3,4,5,6 * * * * *", function () {
    console.log("running a task every minute");

    // 判断今天是否节假日，是的话就不往下执行

    // 读取目录
    fs.readdir("./scheduleTask", function (err, files) {
      if (err) {
        console.log("目录读取失败");
      } else {
        var scheduleFiles = [];
        scheduleFiles.forEach(file => {
          var fileStr = fs.readFileSync(file, "utf-8");

          // 读取文件，每个文件走各自的配置

          // mySchedule.createSchedule(fileStr)
          console.log(
            "读取的文件内容：",
            file,
            "::::",
            fileStr,
            typeof fileStr
          );
        });
      }
    });

    // 写入日志
    // fs.link("./server.log",)
  });
}

exports.addSchedule = addSchedule;
