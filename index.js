const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

app = express();

// second--minute--hour--day of month--month--day of week

const task = cron.schedule("1,2,3,4,5,6 * * * * *", function () {
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

