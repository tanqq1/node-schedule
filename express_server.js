var express = require("express");
var fs = require("fs");
var url = require("url");
var bodyParser = require("body-parser");
var { addSchedule, getUserList } = require("./index");
var { writeContentInFile } = require("./utils/fileHandle.js");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.send("hello world");
});

// 定时任务初始化
addSchedule();
//
app.post("/config/save", function (req, res) {
  writeContentInFile(req.body);

  res.send("post保存成功了呢");
});

app.get("/config.html", function (request, response) {
  var pathname = url.parse(request.url).pathname;

  // 从文件系统中读取请求的文件内容
  fs.readFile(pathname.substr(1), function (err, data) {
    if (err) {
      console.log(err);
      // HTTP 状态码: 404 : NOT FOUND
      // Content Type: text/html
      response.writeHead(404, { "Content-Type": "text/html" });
    } else {
      // HTTP 状态码: 200 : OK
      // Content Type: text/html
      response.writeHead(200, { "Content-Type": "text/html" });

      // 响应文件内容
      response.write(data.toString());
    }
    //  发送响应数据
    response.end();
  });
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("应用实例，访问地址为 http://%s:%s", host, port);
});

module.exports.fileSuffix;
