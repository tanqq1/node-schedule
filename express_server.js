var express = require('express')
const path = require('path')
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');

var app = express()
var fileSuffix = '.schedule.txt'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.send("hello world")
})
app.post('/config/save', function (req, res) {
    console.log("请求参数2......", req.body, typeof req.body)
    const taskFileName = req.body.taskName

    // fs.open(taskFileName + 'schedule.txt', 'a+', function (err, fd) {
    //     if (err) {
    //         console.log("文件打开失败：", err)
    //     } else {
    // }
    // })
    fs.writeFile(taskFileName + fileSuffix, JSON.stringify(req.body) + '\n', { flag: 'a+', 'encoding': 'utf-8' }, function (err) {
        if (err) {
            console.log("文件写入失败....")
        } else {
            console.log("文件写入成功")
        }
    })

    // 读取目录
    fs.readdir('.', function (err, files) {
        if (err) {
            console.log("目录读取失败")
        } else {
            console.log("files....", files)
            var scheduleFiles = []
            files.forEach(file => {
                if (file.endsWith(fileSuffix)) {
                    scheduleFiles.push(path.resolve(__dirname, file))
                }
            })
            scheduleFiles.forEach(file => {
                var fileStr = fs.readFileSync(file, 'utf-8')
                console.log("读取的文件内容：", file, "::::", fileStr, JSON.parse(fileStr))
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