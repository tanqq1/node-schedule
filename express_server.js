var express = require('express')
const path = require('path')
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var { addSchedule, getUserList } = require('./index')

var app = express()
var fileSuffix = '.schedule.js'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.send("hello world")
})
app.post('/config/save', function (req, res) {
    const requestBody = req.body;
    const taskFileName = 'scheduleTask/' + requestBody.taskName + fileSuffix
    requestBody.persons = getUserList(requestBody.persons)

    fs.writeFileSync(taskFileName, `${JSON.stringify(requestBody)}`, { flag: 'w+', 'encoding': 'utf-8' })

    addSchedule()

    // 读取目录
    fs.readdir('.', function (err, files) {
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
                // mySchedule.createSchedule(fileStr)
                console.log("读取的文件内容：", file, "::::", fileStr, typeof fileStr)
            })
        }
    })

    res.send("post保存成功了呢")
})

app.get('/config.html', function (request, response) {
    var pathname = url.parse(request.url).pathname;

    // 从文件系统中读取请求的文件内容
    fs.readFile(pathname.substr(1), function (err, data) {
        if (err) {
            console.log(err);
            // HTTP 状态码: 404 : NOT FOUND
            // Content Type: text/html
            response.writeHead(404, { 'Content-Type': 'text/html' });
        } else {
            // HTTP 状态码: 200 : OK
            // Content Type: text/html
            response.writeHead(200, { 'Content-Type': 'text/html' });

            // 响应文件内容
            response.write(data.toString());
        }
        //  发送响应数据
        response.end();
    });
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

module.exports.fileSuffix