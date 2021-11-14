var cron = require("node-cron");
var express = require("express");
var fs = require("fs");

app = express();

// second--minute--hour--day of month--month--day of week

exports = module.exports = {};


exports.createSchedule = createSchedule

function createSchedule(fileStr) {
    /**值班人员列表 */
    var dutyUsers = []
    /**当前值班人员 */
    var currentDuty = ''
    var configs = handleFileJson(fileStr)
    // cron.schedule("* * 18 * * *", function () {
    //     console.log("running a task at 18 clock every day");
    // });
}

function handleFileJson(fileStr) {
    var str = fileStr.substring(1, fileStr.length - 2)
    var str1 = str.replace(/\"/g, '').split(',')
    var bodyParams = {}
    str1.forEach(item => {
        var str2 = item.split(':')
        bodyParams[str2[0]] = str2[1]
    })
    return bodyParams
}

// 每天18点执行
var task = cron.schedule("* * 18 * * *", function () {
    console.log("running a task every minute");

    // 写入日志
    // fs.link("./server.log",)
});

// setTimeout(() => {
//     if (task) {
//         task.destroy()
//     }
// }, 10 * 1000)

// app.listen(3128);
// task.start()


// setTimeout(() => {
    // 任务销毁
    // task.destroy()
    // 停止定时任务
    // task.stop()
// }, 10 * 1000)

