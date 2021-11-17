var cron = require("node-cron");
var express = require("express");
var fs = require("fs");

app = express();

// second--minute--hour--day of month--month--day of week

exports = module.exports = {};

var fileSuffix = '.schedule.js'


exports.createSchedule = createSchedule

function createSchedule(filePath) {
    // 值班周期
    var isDay = config.period === 'day'
    // 机器人key
    var robotKey = config.robotKey
    cron.schedule("* * 18 * * *", function () {
        console.log("running a task at 18 clock every day");
    });
}

// 定时任务处理器
function scheduleHandler(filePath) {
    var fileContent = fs.readFileSync(filePath)
    try {
        var config = JSON.parse(fileContent)
        if (!config.currentDuty) {
            config.currentDuty = config.persons[0]
        }
        var nextDutyIndex = config.persons.findIndex() + 1
        if (nextDutyIndex > config.persons.length) {
            nextDutyIndex = 0
        }
        // 值班周期
        var isDay = config.period === 'day'
        // 如果是日提醒，那么走日提醒的逻辑，可复用现在的值班逻辑

        // 如果是周提醒，则本周第一天提醒一次 & 本周最后一天做下周的值班预告

        // 定时任务执行成功的话则记录下新的值班人
        // config.currentDuty = config.persons[nextDutyIndex]
        // fs.writeFileSync(filePath, JSON.stringify(config), { flag: 'w+', 'encoding': 'utf-8' })


    } catch (e) {
        console.log(e)
    }
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

function getUserList(userStr) {
    return userStr.split(',').filter(item => !!item)
}

exports.getUserList = getUserList

// 每天18点执行
var task = cron.schedule("* * 18 * * *", function () {
    console.log("running a task every minute");

    // 写入日志
    // fs.link("./server.log",)
});

function addSchedule() {
    cron.schedule("1,2,3,4,5,6 * * * * *", function () {
        console.log("running a task every minute");

        // 判断今天是否节假日，是的话就不往下执行

        // 读取目录
        fs.readdir('./scheduleTask', function (err, files) {
            if (err) {
                console.log("目录读取失败")
            } else {
                var scheduleFiles = []
                files.forEach(file => {
                    if (file.endsWith(fileSuffix)) {
                        scheduleFiles.push(path.resolve(__dirname, file))
                    }
                })
                scheduleFiles.forEach(file => {
                    var fileStr = fs.readFileSync(file, 'utf-8')

                    // 读取文件，每个文件走各自的配置
                    
                    // mySchedule.createSchedule(fileStr)
                    console.log("读取的文件内容：", file, "::::", fileStr, typeof fileStr)
                })
            }
        })

        // 写入日志
        // fs.link("./server.log",)
    });
}

exports.addSchedule = addSchedule

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

